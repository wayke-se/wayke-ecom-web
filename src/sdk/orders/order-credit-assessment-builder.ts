import { IOrderCreditAssessment } from './types';

export class OrderCreditAssessmentBuilder {
  private properties: { [key: string]: any } = {};

  public withScoreId(scoreId: string): OrderCreditAssessmentBuilder {
    this.properties.scoreId = scoreId;

    return this;
  }

  public withFinancialProductCode(code: string): OrderCreditAssessmentBuilder {
    this.properties.financialProductCode = code;

    return this;
  }

  public withRecommendation(recommendation: string): OrderCreditAssessmentBuilder {
    this.properties.recommendation = recommendation;

    return this;
  }

  public withDecision(decision: string): OrderCreditAssessmentBuilder {
    this.properties.decision = decision;

    return this;
  }

  public build(): IOrderCreditAssessment {
    return this.properties as IOrderCreditAssessment;
  }
}
