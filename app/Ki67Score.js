
class Ki67ScoreField {
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