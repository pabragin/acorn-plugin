module.exports = function (acorn) {
  var tt = acorn.tokTypes;

  const beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};

  tt.tildeArrow = new acorn.TokenType("~>", beforeExpr);


  acorn.plugins.myplugin = function (instance) {

    instance.extend('parseExprAtom', function (inner) {
      return function (refShortHandDefaultPos) {
        var canBeArrow = this.potentialArrowAt == this.start;
        switch (this.type) {
          case tt.name:
            var startPos = this.start,
              startLoc = this.startLoc;
            var id = this.parseIdent(this.type !== tt.name);
            if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id]);
            if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.tildeArrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id]);
            return id;
          default:
            return inner.call(this, refShortHandDefaultPos);
        }
      };
    });

    instance.extend('readToken', function (inner) {
      return function (code) {
        if (code === 126) { // '~'
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 62) { // '~>'
            this.pos += 2;
            console.log("Reading a token!");
            return this.finishToken(tt.tildeArrow);//found new token
          }
        }
        return inner.call(this, code);
      };
    });

  };

  return acorn;
};
