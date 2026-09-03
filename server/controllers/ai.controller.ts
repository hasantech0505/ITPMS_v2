/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/ai.service";

export class AIController {
  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await AIService.getSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await AIService.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await AIService.getConversations();
      res.json(conversations);
    } catch (error) {
      next(error);
    }
  }

  static async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;
      const conv = await AIService.createConversation(title);
      res.status(201).json(conv);
    } catch (error) {
      next(error);
    }
  }

  static async updateConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await AIService.updateConversation(id, req.body);
      res.json(updated || { id, ...req.body });
    } catch (error) {
      next(error);
    }
  }

  static async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AIService.deleteConversation(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const messages = await AIService.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = req.params.conversationId || req.body.conversationId || "chat-global";
      const { text, userId } = req.body;
      const message = await AIService.sendMessage(conversationId, text, userId);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  static async getPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const prompts = await AIService.getPrompts();
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }

  static async addPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const prompt = await AIService.addPrompt(req.body);
      res.status(201).json(prompt);
    } catch (error) {
      next(error);
    }
  }

  static async getKnowledgeBase(req: Request, res: Response, next: NextFunction) {
    try {
      const kb = await AIService.getKnowledgeBase();
      res.json(kb);
    } catch (error) {
      next(error);
    }
  }

  static async addKnowledgeDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await AIService.addKnowledgeDoc(req.body);
      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  }

  static async deleteKnowledgeDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AIService.deleteKnowledgeDoc(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const recs = await AIService.getRecommendations();
      res.json(recs);
    } catch (error) {
      next(error);
    }
  }

  static async getModuleInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { module } = req.params;
      const insights = await AIService.getModuleInsights(module);
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }

  static async dismissRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AIService.dismissRecommendation(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async saveFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId, rating, comment } = req.body;
      const feedback = await AIService.saveFeedback(messageId, rating, comment);
      res.json({ success: true, feedback });
    } catch (error) {
      next(error);
    }
  }

  static async getMorningBriefing(req: Request, res: Response, next: NextFunction) {
    try {
      const briefing = await AIService.generateMorningBriefing();
      res.json(briefing);
    } catch (error) {
      next(error);
    }
  }

  static async emailAssistant(req: Request, res: Response, next: NextFunction) {
    try {
      const draft = await AIService.generateEmailDraft(req.body);
      res.json(draft);
    } catch (error) {
      next(error);
    }
  }

  static async documentAssistant(req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await AIService.analyzeDocument(req.body);
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  static async reportGenerator(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await AIService.generateReport(req.body);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async summarizeMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await AIService.summarizeMeeting(req.body);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  static async analyzeContext(req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await AIService.analyzeContext(req.body);
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  static async pipelineSynthesis(req: Request, res: Response, next: NextFunction) {
    try {
      const { residents } = req.body;
      const result = await AIService.generatePipelineSynthesis(Array.isArray(residents) ? residents : []);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async leadStrategy(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.generateLeadStrategy(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Edo Ijro Tizim report — AI writing assistance
  static async edoPolishNarrative(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.polishEdoNarrative(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async edoSummarizeStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.summarizeEdoStats(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async edoComparePeriods(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.compareEdoPeriods(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
