const prodDescriptionPrompt = `Task: write one consise product description for this picture of a clothing item.

					Example product description: Bridge the gap between athletic comfort and smart casual style
					with the Evergreen Commuter Joggers. Crafted from a soft yet durable cotton fabric, these pants
					offer the polished look of chinos combined with the ease of your favorite joggers. They are the
					perfect foundation for effortless, everyday dressing.

					Answer:`;
                    
const modelDescriptionPrompt = `Task: Create a prompt for a {category} model wearing the apparel in this image for a product photo.

                                Key components of prompt:
                                1. The image background is white.
                                2. The model is wearing the exact product in the photo.
                                3. The model looks very real and natural`;

const modelImgGenPrompt = `Task: Generate a product photo using the prompt and image provided.

                  Prompt: {prompt}`;

const chatSystemMessage = `
    You are a product assistant. 
    For the following user input "{userInput}" identify if the user wants a:
    - PRODUCT DESCRIPTIONS: Check if user has sent an image to describe. 
    - PRODUCT IMAGE GEN: Check if the user wants create a product image.
    - PPRODUCT IMAGE EDIT:Check if the user wants edit a product image.
    - If info is missing, ask the user for the missing input.
    - If user asks for anything other than these 3 things, let them know you can only perform these 3 taks.
    - Return output accoirding to OutputSchema Provided.

                        `;

export { prodDescriptionPrompt, modelDescriptionPrompt, modelImgGenPrompt, chatSystemMessage };
