/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PipelineStage = 
  | "New Lead" 
  | "Contacted" 
  | "Meeting Scheduled" 
  | "Interested" 
  | "Document Collection" 
  | "Application Submitted" 
  | "Upcoming Resident";

export const PIPELINE_STAGES: PipelineStage[] = [
  "New Lead",
  "Contacted",
  "Meeting Scheduled",
  "Interested",
  "Document Collection",
  "Application Submitted",
  "Upcoming Resident"
];

export const DEFAULT_PROBABILITIES: Record<PipelineStage, number> = {
  "New Lead": 15,
  "Contacted": 30,
  "Meeting Scheduled": 50,
  "Interested": 65,
  "Document Collection": 80,
  "Application Submitted": 90,
  "Upcoming Resident": 95
};
