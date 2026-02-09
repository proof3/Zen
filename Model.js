import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate} from "@langchain/core/prompts";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableLambda } from "@langchain/core/runnables";

class Model {
  #model = BaseChatModel;
  #textMessage = {type: 'text', text: ''};
  #imageMessage = { type: "image_url", image_url: {url:''}};

  constructor(model) {

    this.#model = model;

  }

  addTextprompt(prompt) {
    this.#textMessage['text'] = ChatPromptTemplate.fromTemplate(prompt);
  }

  addImagePrompt(imageData, mimeType) {

    //get image content and convert to base64
    const base64Image = Buffer.from(imageData).toString('base64');

    this.#imageMessage['image_url']['url'] = `data:${mimeType};base64,${base64Image}`
    //console.log(await llmText.getNumTokens(messages[0].content));
  }

  createChain() {
    if (this.#textMessage['text'] == '') {
      console.error();("Error: need text prompts to generate chain");
      return undefined;

    }

    const formattedPrompt = async (input) => {

      let message = []
      this.#textMessage['text'] = await this.#textMessage['text'].format(input);
      message.push(this.#textMessage)

      if (this.#imageMessage['image_url']['url'] !== '')
        message.push(this.#imageMessage);

      return [new HumanMessage({
        content: message
      })];
    };


    const msgSequence = RunnableLambda.from((userInput) => formattedPrompt(userInput));
    const chain = msgSequence.pipe(this.#model);
    return chain;
  }


}

export default Model;
