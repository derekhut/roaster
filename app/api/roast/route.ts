import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { basicInfo, activities, personalStatement } = await request.json();

    // Combine all information into a comprehensive prompt
    const userInfo = `
Basic Info: ${basicInfo}
Activities & Hobbies: ${activities}
Personal Statement: ${personalStatement}
    `.trim();

    const systemMessage = `You are a professional roast commentator known for your edgy and provocative style. Your task is to roast people based on their self-description. Be edgy and provocative, be mean a little, but don't be cringy or harmful. Focus on being witty and clever while maintaining a fun atmosphere. the roast is in chinese`;

    const generatePromptOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V2.5",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: systemMessage,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userInfo,
              },
            ],
          },
        ],
        stream: false,
      }),
    };

    const generatePromptResponse = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      generatePromptOptions
    );

    if (!generatePromptResponse.ok) {
      const errorText = await generatePromptResponse.text();
      throw new Error(
        `Failed to generate roast: ${generatePromptResponse.status} - ${errorText}`
      );
    }

    const generatePromptData = await generatePromptResponse.json();

    if (
      !generatePromptData.choices ||
      generatePromptData.choices.length === 0 ||
      !generatePromptData.choices[0].message ||
      !generatePromptData.choices[0].message.content
    ) {
      throw new Error("Invalid response format from API");
    }

    const roast = generatePromptData.choices[0].message.content.trim();

    return NextResponse.json({
      success: true,
      roast,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate roast" },
      { status: 500 }
    );
  }
}
