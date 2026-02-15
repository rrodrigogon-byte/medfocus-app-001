/**
 * WebSocket Service for Real-time Notifications
 * Handles real-time updates for:
 * - New materials
 * - Validation approvals
 * - Classroom announcements
 * - Assignment submissions
 * - Discussion replies
 * - Quiz results
 */
import { Server as SocketIOServer, Socket } from "socket.io";

interface UserSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class WebSocketService {
  private io: SocketIOServer;
  private userSockets: Map<string, string[]>; // userId -> [socketId]

  constructor(io: SocketIOServer) {
    this.io = io;
    this.userSockets = new Map();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.io.on("connection", (socket: UserSocket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on("authenticate", (data: { userId: string; role: string }) => {
        socket.userId = data.userId;
        socket.userRole = data.role;

        // Track user sockets
        const sockets = this.userSockets.get(data.userId) || [];
        sockets.push(socket.id);
        this.userSockets.set(data.userId, sockets);

        console.log(`✅ User authenticated: ${data.userId} (${data.role})`);

        // Join user-specific room
        socket.join(`user:${data.userId}`);
        
        // Join role-specific room
        socket.join(`role:${data.role}`);
      });

      // Handle classroom joins
      socket.on("join-classroom", (classroomId: string) => {
        socket.join(`classroom:${classroomId}`);
        console.log(`📚 User joined classroom: ${classroomId}`);
      });

      // Handle classroom leaves
      socket.on("leave-classroom", (classroomId: string) => {
        socket.leave(`classroom:${classroomId}`);
        console.log(`📚 User left classroom: ${classroomId}`);
      });

      // Handle typing indicators
      socket.on("typing", (data: { classroomId: string; threadId?: string }) => {
        const room = data.threadId 
          ? `thread:${data.threadId}` 
          : `classroom:${data.classroomId}`;
        
        socket.to(room).emit("user-typing", {
          userId: socket.userId,
          timestamp: Date.now(),
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        if (socket.userId) {
          const sockets = this.userSockets.get(socket.userId) || [];
          const filtered = sockets.filter((id) => id !== socket.id);
          
          if (filtered.length === 0) {
            this.userSockets.delete(socket.userId);
          } else {
            this.userSockets.set(socket.userId, filtered);
          }
        }
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }

  // Send notification to specific user
  public notifyUser(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    link?: string;
  }): void {
    this.io.to(`user:${userId}`).emit("notification", {
      ...notification,
      timestamp: Date.now(),
    });
  }

  // Send notification to all users in a classroom
  public notifyClassroom(classroomId: string, notification: {
    type: string;
    title: string;
    message: string;
    link?: string;
  }): void {
    this.io.to(`classroom:${classroomId}`).emit("notification", {
      ...notification,
      timestamp: Date.now(),
    });
  }

  // Send notification to all users with a specific role
  public notifyRole(role: string, notification: {
    type: string;
    title: string;
    message: string;
    link?: string;
  }): void {
    this.io.to(`role:${role}`).emit("notification", {
      ...notification,
      timestamp: Date.now(),
    });
  }

  // Broadcast new material
  public broadcastNewMaterial(material: {
    id: string;
    title: string;
    type: string;
    universityId: string;
    subjectId: string;
  }): void {
    this.io.emit("new-material", {
      ...material,
      timestamp: Date.now(),
    });
  }

  // Broadcast material validation
  public broadcastMaterialValidation(data: {
    materialId: string;
    materialTitle: string;
    status: string;
    uploaderId: string;
  }): void {
    // Notify uploader
    this.notifyUser(data.uploaderId, {
      type: "validation",
      title: "Material Validado",
      message: `Seu material "${data.materialTitle}" foi ${
        data.status === "approved" ? "aprovado" : "rejeitado"
      }`,
      link: `/materials/${data.materialId}`,
    });

    // Notify all professors
    this.notifyRole("professor", {
      type: "validation",
      title: "Validação Concluída",
      message: `Material "${data.materialTitle}" foi validado`,
      link: `/materials/${data.materialId}`,
    });
  }

  // Broadcast new announcement in classroom
  public broadcastAnnouncement(classroomId: string, announcement: {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
  }): void {
    this.notifyClassroom(classroomId, {
      type: "announcement",
      title: announcement.isPinned ? "📌 Anúncio Fixado" : "📢 Novo Anúncio",
      message: announcement.title,
      link: `/classrooms/${classroomId}/announcements/${announcement.id}`,
    });
  }

  // Broadcast new assignment
  public broadcastAssignment(classroomId: string, assignment: {
    id: string;
    title: string;
    dueDate: string;
  }): void {
    this.notifyClassroom(classroomId, {
      type: "assignment",
      title: "📝 Nova Atividade",
      message: `${assignment.title} - Prazo: ${new Date(assignment.dueDate).toLocaleDateString()}`,
      link: `/classrooms/${classroomId}/assignments/${assignment.id}`,
    });
  }

  // Broadcast assignment submission
  public notifyAssignmentSubmission(data: {
    professorId: string;
    studentName: string;
    assignmentTitle: string;
    classroomId: string;
    assignmentId: string;
  }): void {
    this.notifyUser(data.professorId, {
      type: "submission",
      title: "📨 Nova Submissão",
      message: `${data.studentName} enviou "${data.assignmentTitle}"`,
      link: `/classrooms/${data.classroomId}/assignments/${data.assignmentId}`,
    });
  }

  // Broadcast assignment grade
  public notifyAssignmentGrade(data: {
    studentId: string;
    assignmentTitle: string;
    score: number;
    classroomId: string;
    assignmentId: string;
  }): void {
    this.notifyUser(data.studentId, {
      type: "grade",
      title: "📊 Atividade Corrigida",
      message: `Você recebeu ${data.score} pontos em "${data.assignmentTitle}"`,
      link: `/classrooms/${data.classroomId}/assignments/${data.assignmentId}`,
    });
  }

  // Broadcast new discussion reply
  public notifyDiscussionReply(data: {
    authorId: string;
    authorName: string;
    threadId: string;
    threadTitle: string;
    classroomId?: string;
  }): void {
    this.io.to(`thread:${data.threadId}`).emit("new-reply", {
      authorId: data.authorId,
      authorName: data.authorName,
      threadId: data.threadId,
      timestamp: Date.now(),
    });
  }

  // Get online users count
  public getOnlineUsersCount(): number {
    return this.userSockets.size;
  }

  // Check if user is online
  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
