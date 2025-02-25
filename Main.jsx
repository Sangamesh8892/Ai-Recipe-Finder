import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import {  getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        []
    )
    const [loading, setLoading] = React.useState(false)
    const [recipe, setRecipe] = React.useState("")
    const recipeSection =React.useRef(null)

    async function getRecipe() {
        setLoading(true);
        const recipeMarkdown = await getRecipeFromMistral(ingredients)
        setRecipe(recipeMarkdown)
        setLoading(false);

    }
    function removeIngredient(ingredientToRemove) {
        setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient !== ingredientToRemove))
    }
    function addIngredient(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        event.target.reset()
    }
    React.useEffect(() => {
        if(recipe && recipeSection.current !== null)
        {  recipeSection.current.scrollIntoView({behavior: "smooth"})} 
    },[recipe, recipeSection.current])
    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    recipeSection={recipeSection}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    removefunc={removeIngredient}
                />
            }
            {loading && <p>Loading...</p>}
            {!loading &&recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}