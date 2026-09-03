/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();

// Settings
router.get("/settings", AIController.getSettings);
router.post("/settings", AIController.updateSettings);

// Conversations
router.get("/conversations", AIController.getConversations);
router.post("/conversations", AIController.createConversation);
router.put("/conversations/:id", AIController.updateConversation);
router.delete("/conversations/:id", AIController.deleteConversation);

// Messages
router.get("/messages/:conversationId", AIController.getMessages);
router.post("/messages/:conversationId", AIController.sendMessage);
router.post("/messages", AIController.sendMessage);

// Prompts
router.get("/prompts", AIController.getPrompts);
router.post("/prompts", AIController.addPrompt);

// Knowledge Base (RAG)
router.get("/knowledge", AIController.getKnowledgeBase);
router.post("/knowledge", AIController.addKnowledgeDoc);
router.delete("/knowledge/:id", AIController.deleteKnowledgeDoc);

// Recommendations
router.get("/recommendations", AIController.getRecommendations);
router.put("/recommendations/:id/dismiss", AIController.dismissRecommendation);

// Per-module insights cards (Residents, CRM, Startups, Executive)
router.get("/insights/:module", AIController.getModuleInsights);

// Feedback & Briefing
router.post("/feedback", AIController.saveFeedback);
router.get("/briefing", AIController.getMorningBriefing);

// Executive Tools
router.post("/email-assistant", AIController.emailAssistant);
router.post("/document-assistant", AIController.documentAssistant);
router.post("/report-generator", AIController.reportGenerator);
router.post("/summarize-meeting", AIController.summarizeMeeting);
router.post("/analyze-context", AIController.analyzeContext);
router.post("/pipeline-synthesis", AIController.pipelineSynthesis);
router.post("/lead-strategy", AIController.leadStrategy);

// Edo Ijro Tizim quarterly report — AI writing assistance
router.post("/edo/polish", AIController.edoPolishNarrative);
router.post("/edo/summarize-stats", AIController.edoSummarizeStats);
router.post("/edo/compare-periods", AIController.edoComparePeriods);

export default router;
