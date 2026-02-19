/**
 * WebSocket Battle Server — Real-time 1v1 Question Duels
 * Handles matchmaking, question sync, live scoring, and result broadcasting
 */
import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { REAL_QUESTIONS } from '../client/src/data/realQuestions';

// ─── Types ──────────────────────────────────────────────────────
interface BattleRoom {
  id: string;
  code: string;
  hostId: string;
  hostName: string;
  hostWs: WebSocket | null;
  guestId: string | null;
  guestName: string | null;
  guestWs: WebSocket | null;
  questionIds: string[];
  totalQuestions: number;
  specialty: string | null;
  status: 'waiting' | 'playing' | 'completed';
  hostAnswers: Record<number, { answer: string; correct: boolean; time: number }>;
  guestAnswers: Record<number, { answer: string; correct: boolean; time: number }>;
  hostScore: number;
  guestScore: number;
  currentQuestion: number;
  startedAt: number | null;
  createdAt: number;
}

interface WsMessage {
  type: string;
  [key: string]: any;
}

// ─── State ──────────────────────────────────────────────────────
const rooms = new Map<string, BattleRoom>();
const clientToRoom = new Map<WebSocket, string>();

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function pickQuestions(count: number, specialty?: string | null): string[] {
  let pool = REAL_QUESTIONS;
  if (specialty) {
    pool = pool.filter(q => q.area === specialty);
  }
  if (pool.length < count) pool = REAL_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(q => q.id);
}

function getQuestionData(questionId: string) {
  const q = REAL_QUESTIONS.find(r => r.id === questionId);
  if (!q) return null;
  return {
    id: q.id,
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    area: q.area,
    source: q.source,
  };
}

function sendTo(ws: WebSocket | null, msg: WsMessage) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function broadcastToRoom(room: BattleRoom, msg: WsMessage) {
  sendTo(room.hostWs, msg);
  sendTo(room.guestWs, msg);
}

function cleanupRoom(roomId: string) {
  const room = rooms.get(roomId);
  if (room) {
    if (room.hostWs) clientToRoom.delete(room.hostWs);
    if (room.guestWs) clientToRoom.delete(room.guestWs);
    rooms.delete(roomId);
  }
}

// Clean up expired rooms every 5 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rooms.entries());
  for (const [id, room] of entries) {
    if (now - room.createdAt > 30 * 60 * 1000) { // 30 min expiry
      cleanupRoom(id);
    }
  }
}, 5 * 60 * 1000);

// ─── Message Handlers ───────────────────────────────────────────
function handleCreateRoom(ws: WebSocket, msg: WsMessage) {
  const code = generateCode();
  const roomId = `battle_${code}_${Date.now()}`;
  const totalQ = Math.min(Math.max(msg.totalQuestions || 10, 5), 20);
  const questionIds = pickQuestions(totalQ, msg.specialty);

  const room: BattleRoom = {
    id: roomId,
    code,
    hostId: msg.userId,
    hostName: msg.userName || 'Jogador 1',
    hostWs: ws,
    guestId: null,
    guestName: null,
    guestWs: null,
    questionIds,
    totalQuestions: totalQ,
    specialty: msg.specialty || null,
    status: 'waiting',
    hostAnswers: {},
    guestAnswers: {},
    hostScore: 0,
    guestScore: 0,
    currentQuestion: 0,
    startedAt: null,
    createdAt: Date.now(),
  };

  rooms.set(roomId, room);
  clientToRoom.set(ws, roomId);

  sendTo(ws, {
    type: 'room_created',
    roomId,
    code,
    totalQuestions: totalQ,
    specialty: room.specialty,
  });
}

function handleJoinRoom(ws: WebSocket, msg: WsMessage) {
  const code = (msg.code || '').toUpperCase();
  let targetRoom: BattleRoom | null = null;
  const allRooms = Array.from(rooms.values());
  for (const room of allRooms) {
    if (room.code === code && room.status === 'waiting') {
      targetRoom = room;
      break;
    }
  }

  if (!targetRoom) {
    sendTo(ws, { type: 'error', message: 'Sala não encontrada ou já iniciada' });
    return;
  }

  if (targetRoom.hostId === msg.userId) {
    sendTo(ws, { type: 'error', message: 'Você não pode entrar na própria sala' });
    return;
  }

  targetRoom.guestId = msg.userId;
  targetRoom.guestName = msg.userName || 'Jogador 2';
  targetRoom.guestWs = ws;
  clientToRoom.set(ws, targetRoom.id);

  // Notify both players
  sendTo(targetRoom.hostWs, {
    type: 'player_joined',
    guestName: targetRoom.guestName,
    guestId: targetRoom.guestId,
  });

  sendTo(ws, {
    type: 'joined_room',
    roomId: targetRoom.id,
    code: targetRoom.code,
    hostName: targetRoom.hostName,
    totalQuestions: targetRoom.totalQuestions,
    specialty: targetRoom.specialty,
  });
}

function handleStartBattle(ws: WebSocket, msg: WsMessage) {
  const roomId = clientToRoom.get(ws);
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.hostWs !== ws || !room.guestWs) return;

  room.status = 'playing';
  room.startedAt = Date.now();
  room.currentQuestion = 0;

  const firstQ = getQuestionData(room.questionIds[0]);
  broadcastToRoom(room, {
    type: 'battle_started',
    totalQuestions: room.totalQuestions,
    hostName: room.hostName,
    guestName: room.guestName,
    question: firstQ,
    questionIndex: 0,
  });
}

function handleAnswer(ws: WebSocket, msg: WsMessage) {
  const roomId = clientToRoom.get(ws);
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return;

  const isHost = ws === room.hostWs;
  const qIndex = msg.questionIndex;
  const answerLetter = msg.answerLetter as string;
  const timeMs = msg.timeMs || 0;

  const qData = getQuestionData(room.questionIds[qIndex]);
  if (!qData) return;

  const isCorrect = answerLetter === qData.correctAnswer;
  const answerRecord = { answer: answerLetter, correct: isCorrect, time: timeMs };

  if (isHost) {
    room.hostAnswers[qIndex] = answerRecord;
    if (isCorrect) room.hostScore++;
  } else {
    room.guestAnswers[qIndex] = answerRecord;
    if (isCorrect) room.guestScore++;
  }

  // Notify opponent of answer
  const opponent = isHost ? room.guestWs : room.hostWs;
  sendTo(opponent, {
    type: 'opponent_answered',
    questionIndex: qIndex,
    timeMs,
  });

  // Send answer result to the player
  sendTo(ws, {
    type: 'answer_result',
    questionIndex: qIndex,
    correct: isCorrect,
    correctAnswer: qData.correctAnswer,
    hostScore: room.hostScore,
    guestScore: room.guestScore,
  });

  // Check if both answered this question
  const hostAnswered = room.hostAnswers[qIndex] !== undefined;
  const guestAnswered = room.guestAnswers[qIndex] !== undefined;

  if (hostAnswered && guestAnswered) {
    // Both answered — send scores and move to next question
    broadcastToRoom(room, {
      type: 'question_complete',
      questionIndex: qIndex,
      hostAnswer: room.hostAnswers[qIndex],
      guestAnswer: room.guestAnswers[qIndex],
      hostScore: room.hostScore,
      guestScore: room.guestScore,
      correctAnswer: qData.correctAnswer,
    });

    const nextIndex = qIndex + 1;
    if (nextIndex >= room.totalQuestions) {
      // Battle complete
      room.status = 'completed';
      const winner = room.hostScore > room.guestScore ? 'host' :
                     room.guestScore > room.hostScore ? 'guest' : 'draw';
      broadcastToRoom(room, {
        type: 'battle_complete',
        hostScore: room.hostScore,
        guestScore: room.guestScore,
        hostName: room.hostName,
        guestName: room.guestName,
        winner,
        totalQuestions: room.totalQuestions,
      });

      // Clean up after 60 seconds
      setTimeout(() => cleanupRoom(room.id), 60000);
    } else {
      // Next question after 3 second delay
      setTimeout(() => {
        const nextQ = getQuestionData(room.questionIds[nextIndex]);
        broadcastToRoom(room, {
          type: 'next_question',
          question: nextQ,
          questionIndex: nextIndex,
          hostScore: room.hostScore,
          guestScore: room.guestScore,
        });
      }, 3000);
    }
  }
}

function handleQuickMatch(ws: WebSocket, msg: WsMessage) {
  // Find a waiting room or create one
  let waitingRoom: BattleRoom | null = null;
  const allRooms = Array.from(rooms.values());
  for (const room of allRooms) {
    if (room.status === 'waiting' && !room.guestId && room.hostId !== msg.userId) {
      waitingRoom = room;
      break;
    }
  }

  if (waitingRoom) {
    // Join existing room
    handleJoinRoom(ws, { ...msg, code: waitingRoom.code });
    // Auto-start after 2 seconds
    setTimeout(() => {
      if (waitingRoom && waitingRoom.hostWs && waitingRoom.guestWs) {
        handleStartBattle(waitingRoom.hostWs, { type: 'start_battle' });
      }
    }, 2000);
  } else {
    // Create new room and wait
    handleCreateRoom(ws, msg);
    sendTo(ws, { type: 'waiting_for_opponent' });
  }
}

// ─── WebSocket Server Setup ─────────────────────────────────────
export function setupBattleWs(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws/battle' });

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      try {
        const msg: WsMessage = JSON.parse(raw.toString());
        switch (msg.type) {
          case 'create_room': handleCreateRoom(ws, msg); break;
          case 'join_room': handleJoinRoom(ws, msg); break;
          case 'start_battle': handleStartBattle(ws, msg); break;
          case 'answer': handleAnswer(ws, msg); break;
          case 'quick_match': handleQuickMatch(ws, msg); break;
          case 'ping': sendTo(ws, { type: 'pong' }); break;
          default: break;
        }
      } catch (err) {
        console.error('[BattleWS] Parse error:', err);
      }
    });

    ws.on('close', () => {
      const roomId = clientToRoom.get(ws);
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          const isHost = ws === room.hostWs;
          const opponent = isHost ? room.guestWs : room.hostWs;
          sendTo(opponent, { type: 'opponent_disconnected' });
          if (room.status === 'waiting') {
            cleanupRoom(roomId);
          }
        }
        clientToRoom.delete(ws);
      }
    });

    // Send welcome
    sendTo(ws, { type: 'connected', timestamp: Date.now() });
  });

  console.log('[BattleWS] WebSocket server ready on /ws/battle');
}
