export class Ki67ScoreField {
    constructor(negCount, posCount, fieldType) {
      this.negCount = negCount;
      this.posCount = posCount;
      this.fieldType = fieldType;
    }
  
    setNegCount(negCount) {
      this.negCount = negCount;
    }
  
    setPosCount(posCount) {
      this.posCount = posCount;
    }
  
    getScore() {
      return Math.round((this.posCount / (this.negCount + this.posCount)) * 1000) / 10;
    }
}

export class Ki67ResultField {
  constructor(type, percentage, fields) {
    this.typeName = this.getHumanName(type);
    this.percentage = percentage;
    this.fields = fields;
    this.color = this.getColor(type);
  }

  getHumanName(fieldType) {
    switch (fieldType) {
      case Ki67Score.FIELD_TYPE_HIGH:
        return "High";
      case Ki67Score.FIELD_TYPE_MED:
        return "Medium";
      case Ki67Score.FIELD_TYPE_LOW:
        return "Low";
      case Ki67Score.FIELD_TYPE_NEG:
        return "Negligible";
    }
  }

  getColor(fieldType) {
    switch (fieldType) {
      case Ki67Score.FIELD_TYPE_HIGH:
        return 'red';
      case Ki67Score.FIELD_TYPE_MED:
        return 'orange';
      case Ki67Score.FIELD_TYPE_LOW:
        return 'green';
      case Ki67Score.FIELD_TYPE_NEG:
        return 'black';
    }
  }
}

export class Ki67ScoresByType {

  constructor(ki67Score) {
    this.ki67Score = ki67Score;
  }

  getAllReportFields() {
    
    let negField = new Ki67ResultField(Ki67Score.FIELD_TYPE_NEG, this.ki67Score.pNeg, this.ki67Score.getFieldsNeg());
    let lowField = new Ki67ResultField(Ki67Score.FIELD_TYPE_LOW, this.ki67Score.pLow, this.ki67Score.getFieldsLow());
    let medField = new Ki67ResultField(Ki67Score.FIELD_TYPE_MED, this.ki67Score.pMed, this.ki67Score.getFieldsMed());
    let highField = new Ki67ResultField(Ki67Score.FIELD_TYPE_HIGH, this.ki67Score.pHigh, this.ki67Score.getFieldsHigh());

    return [negField, lowField, medField, highField];
  }
  
}
  
export class Ki67Score {
    static FIELD_TYPE_HIGH = "High";
    static FIELD_TYPE_MED = "Medium";
    static FIELD_TYPE_LOW = "Low";
    static FIELD_TYPE_NEG = "Negligible";
  
    constructor(pNeg, pLow, pMed, pHigh) {
      this.pNeg = pNeg;
      this.pLow = pLow;
      this.pMed = pMed;
      this.pHigh = pHigh;
      this.ki67ScoreFields = [];
      this.comments = "";
    }
  
    getColor(fieldType) {
      switch (fieldType) {
        case Ki67Score.FIELD_TYPE_HIGH:
          return 'red';
        case Ki67Score.FIELD_TYPE_MED:
          return 'orange';
        case Ki67Score.FIELD_TYPE_LOW:
          return 'green';
        case Ki67Score.FIELD_TYPE_NEG:
          return 'black';
      }
    }

    getComments() {
      return this.comments;
    }

    setComments(comments) {
      this.comments = comments;
    }
  
    addField(negCount, posCount, fieldType) {
      this.ki67ScoreFields.push(new Ki67ScoreField(negCount, posCount, fieldType));
    }
  
    showNumFields() {
      return this.ki67ScoreFields.length;
    }
  
    setNegCount(i, negCount) {
      this.ki67ScoreFields[i].setNegCount(negCount);
    }
  
    setPosCount(i, posCount) {
      this.ki67ScoreFields[i].setPosCount(posCount);
    }
  
    getFields(fieldType) {
      const outputFields = [];
      for (let field of this.ki67ScoreFields) {
        if (field.fieldType == fieldType) {
          outputFields.push(field);
        }
      }
      return outputFields;
    }

    getFieldByIndex(index) {
      return this.ki67ScoreFields[index];
    }
  
    getFieldsNeg() {
      return this.getFields(Ki67Score.FIELD_TYPE_NEG);
    }
  
    getFieldsLow() {
      return this.getFields(Ki67Score.FIELD_TYPE_LOW);
    }
  
    getFieldsMed() {
      return this.getFields(Ki67Score.FIELD_TYPE_MED);
    }
  
    getFieldsHigh() {
      return this.getFields(Ki67Score.FIELD_TYPE_HIGH);
    }
  
    getGlobalScore() {
      let totalNegCount = 0;
      let totalPosCount = 0;
      for (let field of this.ki67ScoreFields) {
        totalNegCount += field.negCount;
        totalPosCount += field.posCount;
      }
      return Math.round((totalPosCount / (totalPosCount + totalNegCount)) * 1000) / 10;
    }
  
    getWeightedGlobalScore() {
      const negCount = {};
      const posCount = {};
      negCount[Ki67Score.FIELD_TYPE_NEG] = 0;
      negCount[Ki67Score.FIELD_TYPE_LOW] = 0;
      negCount[Ki67Score.FIELD_TYPE_MED] = 0;
      negCount[Ki67Score.FIELD_TYPE_HIGH] = 0;
      posCount[Ki67Score.FIELD_TYPE_NEG] = 0;
      posCount[Ki67Score.FIELD_TYPE_LOW] = 0;
      posCount[Ki67Score.FIELD_TYPE_MED] = 0;
      posCount[Ki67Score.FIELD_TYPE_HIGH] = 0;
      for (let field of this.ki67ScoreFields) {
        negCount[field.fieldType] += field.negCount;
        posCount[field.fieldType] += field.posCount;
      }
      let finalScore = 0;
      if (this.pNeg > 0 && (posCount[Ki67Score.FIELD_TYPE_NEG] + negCount[Ki67Score.FIELD_TYPE_NEG]) > 0) {
        finalScore +=
          (this.pNeg / 100) *
          (posCount[Ki67Score.FIELD_TYPE_NEG] /
            (posCount[Ki67Score.FIELD_TYPE_NEG] + negCount[Ki67Score.FIELD_TYPE_NEG]));
      }
      if (this.pLow > 0 && (posCount[Ki67Score.FIELD_TYPE_LOW] + negCount[Ki67Score.FIELD_TYPE_LOW]) > 0) {
        finalScore +=
          (this.pLow / 100) *
          (posCount[Ki67Score.FIELD_TYPE_LOW] /
            (posCount[Ki67Score.FIELD_TYPE_LOW] + negCount[Ki67Score.FIELD_TYPE_LOW]));
      }
      if (this.pMed > 0 && (posCount[Ki67Score.FIELD_TYPE_MED] + negCount[Ki67Score.FIELD_TYPE_MED]) > 0) {
        finalScore +=
          (this.pMed / 100) *
          (posCount[Ki67Score.FIELD_TYPE_MED] /
            (posCount[Ki67Score.FIELD_TYPE_MED] + negCount[Ki67Score.FIELD_TYPE_MED]));
      }
      if (this.pHigh > 0 && (posCount[Ki67Score.FIELD_TYPE_HIGH] + negCount[Ki67Score.FIELD_TYPE_HIGH]) > 0) {
        finalScore +=
          (this.pHigh / 100) *
          (posCount[Ki67Score.FIELD_TYPE_HIGH] /
            (posCount[Ki67Score.FIELD_TYPE_HIGH] + negCount[Ki67Score.FIELD_TYPE_HIGH]));
      }
      return Math.round(finalScore * 1000) / 10;
    }
}