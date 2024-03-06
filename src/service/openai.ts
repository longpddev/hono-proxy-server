
import {ChatOpenAI} from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const openai = new ChatOpenAI({
  temperature: 0.25,
  maxConcurrency: 10,
  timeout: 60000,
  azureOpenAIBasePath:
      "https://chat-bot-ai.openai.azure.com/openai/deployments",
  azureOpenAIApiEmbeddingsDeploymentName: "chat-bot-ai-embedding",
  azureOpenAIApiDeploymentName: "chat-gpt-4",
  azureOpenAIApiKey: "27a2854000c446e9805c326d7dc843be",
  azureOpenAIApiVersion: "2024-02-15-preview",
});

export async function vocabularyToKeyWords(str: string) {
  const explain = await openai.invoke([
      new SystemMessage("You are a translator."),
      new HumanMessage(
          `Explain the meaning of "${str}" with one sentence. Just a sentence:`
      ),
  ]);

  const result = await openai.invoke([
      new HumanMessage(
          `summarize the sentence "${
              explain.content as string
          }" into 3 keywords. Just 3 keywords:`
      ),
  ]);
  console.log("🚀 ~ vocabularyToKeyWords ~ result:", result.content);

  return (result.content as string)
      .split(",")
      .map((item) => item.trim().toLowerCase());
}