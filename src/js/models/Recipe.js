import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch(e) {
      alert('Opps something broke');
    }
  }
  calcTime(){
    // 15  minutes ofr every three items
    const numingredients = this.ingredients.length;
    const intervals = Math.ceil(numingredients / 3);
    this.time = intervals * 15;
  }
  calcServings(){
    this.servings = 4
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];
    const newIngredients = this.ingredients.map(el => {
      // make units all the same
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // remove parens
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // parse ingredients into coun, unit and ingredient
      const arrIngredient = ingredient.split(' ');
      const unitIndex = arrIngredient.findIndex(el2 => units.includes(el2));

      let objIngredient; 
      if(unitIndex > -1) {
        // found a unit
        const arrCount = arrIngredient.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngredient[0].replace('-', '+'));
        } else {
          count = eval(arrIngredient.slice(0, unitIndex).join('+'));
        }

        objIngredient = {
          count,
          unit: arrIngredient[unitIndex],
          ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIngredient[0], 10)) {
        // This an element but not a measurement 
        objIngredient = {
          count: parseInt(arrIngredient[0], 10),
          unit: '',
          ingredient: arrIngredient.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // unit does not exist
        objIngredient = {
          count: 1,
          unit: '',
          ingredient
        }
      }

      return objIngredient;
    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {
    //serving
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    
    // ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });

    this.servings = newServings;
  }

}

