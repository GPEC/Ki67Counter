class ScoringFieldsAllocator {
    constructor() {
      // do nothing
    }
  
    allDifferent(a, b, c) {
      return !(a == b || a == c || b == c);
    }
  
    init(percent_negligible, percent_low, percent_medium, percent_high) {
      this.percent_negligible = percent_negligible;
      this.percent_low = percent_low;
      this.percent_medium = percent_medium;
      this.percent_high = percent_high;
  
      var THRESHOLD = 25;
  
      this.numNegligible = percent_negligible == 0 ? 0 : 1;
      this.numLow = percent_low == 0 ? 0 : 1;
      this.numMedium = percent_medium == 0 ? 0 : 1;
      this.numHigh = percent_high == 0 ? 0 : 1;
  
      var requiredNumFields = 4;
      var numFieldsRemaining = requiredNumFields - this.numNegligible - this.numLow - this.numMedium - this.numHigh;
  
      if (numFieldsRemaining == 0) {
        return;
      } else if (numFieldsRemaining == 1) {
        if (
          percent_high > Math.max(percent_medium, percent_low, percent_negligible) &&
          this.allDifferent(percent_medium, percent_low, percent_negligible)
        ) {
          this.numHigh++;
        } else if (
          percent_medium > Math.max(percent_high, percent_low, percent_negligible) &&
          this.allDifferent(percent_high, percent_low, percent_negligible)
        ) {
          this.numMedium++;
        } else if (
          percent_low > Math.max(percent_high, percent_medium, percent_negligible) &&
          this.allDifferent(percent_high, percent_medium, percent_negligible)
        ) {
          this.numLow++;
        } else if (
          percent_negligible > Math.max(percent_high, percent_medium, percent_low) &&
          this.allDifferent(percent_high, percent_medium, percent_low)
        ) {
          this.numNegligible++;
        } else {
          // there must be a tie ... only pick and score three fields.
        }
      } else if (numFieldsRemaining == 2) {
        this.numNegligible = this.numNegligible + (this.numNegligible > 0 ? 1 : 0);
        this.numLow = this.numLow + (this.numLow > 0 ? 1 : 0);
        this.numMedium = this.numMedium + (this.numMedium > 0 ? 1 : 0);
        this.numHigh = this.numHigh + (this.numHigh > 0 ? 1 : 0);
        if (
          Math.max(
            percent_high == 0 ? 0 : Math.abs(percent_high - Math.max(percent_medium, percent_low, percent_negligible)),
            percent_medium == 0 ? 0 : Math.abs(percent_medium - Math.max(percent_high, percent_low, percent_negligible)),
            percent_low == 0 ? 0 : Math.abs(percent_low - Math.max(percent_high, percent_medium, percent_negligible)),
            percent_negligible == 0 ? 0 : Math.abs(percent_negligible - Math.max(percent_high, percent_medium, percent_low))
          ) >= THRESHOLD
        ) {
          if (percent_high != 0 && percent_high < Math.max(percent_medium, percent_low, percent_negligible)) {
            this.numHigh--;
            this.numMedium = this.numMedium + (this.numMedium == 2 ? 1 : 0);
            this.numLow = this.numLow + (this.numLow == 2 ? 1 : 0);
            this.numNegligible = this.numNegligible + (this.numNegligible == 2 ? 1 : 0);
          } else if (
            percent_medium != 0 &&
            percent_medium < Math.max(percent_high, percent_low, percent_negligible)
          ) {
            this.numMedium--;
            this.numHigh = this.numHigh + (this.numHigh == 2 ? 1 : 0);
            this.numLow = this.numLow + (this.numLow == 2 ? 1 : 0);
            this.numNegligible = this.numNegligible + (this.numNegligible == 2 ? 1 : 0);
          } else if (
            percent_low != 0 && percent_low < Math.max(percent_high, percent_medium, percent_negligible)
          ) {
            this.numLow--;
            this.numHigh = this.numHigh + (this.numHigh == 2 ? 1 : 0);
            this.numMedium = this.numMedium + (this.numMedium == 2 ? 1 : 0);
            this.numNegligible = this.numNegligible + (this.numNegligible == 2 ? 1 : 0);
          } else {
            this.numNegligible--;
            this.numHigh = this.numHigh + (this.numHigh == 2 ? 1 : 0);
            this.numMedium = this.numMedium + (this.numMedium == 2 ? 1 : 0);
            this.numLow = this.numLow + (this.numLow == 2 ? 1 : 0);
          }
        }
      } else {
        if (this.numNegligible > 0) {
          this.numNegligible = this.numNegligible + 3;
        } else if (this.numLow > 0) {
          this.numLow = this.numLow + 3;
        } else if (this.numMedium > 0) {
          this.numMedium = this.numMedium + 3;
        } else {
          this.numHigh = this.numHigh + 3;
        }
      }
    }
  
    getNumNegligible() {
      return this.numNegligible;
    }
  
    getNumLow() {
      return this.numLow;
    }
  
    getNumMedium() {
      return this.numMedium;
    }
  
    getNumHigh() {
      return this.numHigh;
    }
}

export { ScoringFieldsAllocator };