from bedrock.templates.templates import (
    InitialScreeningTemplate,
    TeamAssessmentTemplate,
    TechnologyEvaluationTemplate,
    FinancialReviewTemplate,
    MarketAnalysisTemplate,
)


all_templates = [
    InitialScreeningTemplate(),
    TeamAssessmentTemplate(),
    TechnologyEvaluationTemplate(),
    FinancialReviewTemplate(),
    MarketAnalysisTemplate(),
]


__all__ = [
    "all_templates",
]
