import { TARGETS } from "../config/targets";

export function calculateTeamTargets(totalAgents) {
  return {
    freshCalls: totalAgents * TARGETS.freshCalls.target,
    tickets: totalAgents * TARGETS.tickets.target,
    insurance: totalAgents * TARGETS.insurance.target,
    google: totalAgents * TARGETS.googleReviews.target,
    trustpilot: totalAgents * TARGETS.trustpilotReviews.target,
  };
}