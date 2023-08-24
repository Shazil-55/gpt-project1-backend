// models/User.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getUserById() {
  try {
    const user = await prisma.user.findMany();
    // return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}


async function checkUser(key) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        liscenceKey: key,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}



async function isUser(userEmail) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

async function createUser(json)
{
  try
  {
    const user = await prisma.user.create({
      data: json,
    }); 
    const upsertedSettings = await prisma.Settings.create({
      data:{
        gpt:"gpt-3.5",
        title:24,
        showPrompt:false,
        color:'rgb(225, 239, 255)',
        userId:user.id,
        result:24,
      }
    })
    const defaultRoles = [
      {name: "Reply",prompt: "Provide me a reply on the given keywords", userId: user.id, reply:"false"},
      {name: "Summary",prompt: "Summarize the given text", userId: user.id, reply:"false"},
      {name: "Explain",prompt: "Explain the selected text in simpler terms.", userId: user.id, reply:"false"},
      {name: "Sum up",prompt: " Sum up the main points of the selected text.", userId: user.id, reply:"false"},
      {name: "Opinion",prompt: "Share your opinion on the selected text.", userId: user.id, reply:"false"},
      {name: "Example",prompt: "Provide an example related to the selected text", userId: user.id, reply:"false"},
      {name: "Scenario",prompt: "Describe a scenario where the selected text applies.", userId: user.id, reply:"false"},
      {name: "Conclusion",prompt: "Draw a conclusion from the information in the selected text.", userId: user.id, reply:"false"},

      {name: "Reply",prompt: "Provide me a reply on the given keywords", userId: user.id, reply:"true"},
      {name: "Support",prompt: "write an argument in the support of the text", userId: user.id, reply:"true"},
      {name: "Congratulate",prompt: "Congratulate on the given work", userId: user.id, reply:"true"},
      {name: "Review",prompt: "Write a review about this product whose description i have provided", userId: user.id, reply:"true"},
    ];



    const role = await prisma.Role.createMany({
      data: defaultRoles,
    
    })

    const defaultShortcuts = [
      {name: "Trigger QuickyAI or open response window",keys: "Alt+Q", userId: user.id},
      {name: "To close the response window",keys: "Alt+S", userId: user.id},
      {name: "Copy selected text to response window",keys: "Alt+C", userId: user.id},
      {name: "Summarize the web page",keys: "Alt+W", userId: user.id},
      {name: "Activate/Open Extension Popup",keys: "", userId: user.id},
    ]

    const shortCuts = await prisma.ShortCuts.createMany({
      data: defaultShortcuts,
    })


    return user;
  }catch(error){
    console.error("Error Creating User :", error);
    
  }
}



async function createNewChat(json)
{
  try
  {
    const user = await prisma.user.findFirst({
      where:{
        email:json.email
      },
    })
    if(user)
    {
      var existingChat;
        if(!existingChat)
        {
          const newChat = await prisma.Chat.create({
            data:{
              question: json.title,
              answer:json.answer,
              prompt:"reply",
              webPageUrl:"1",
              userId: user.id,
              responses : 1,
              title : json.title
            }
          });  
          const extendChatNew = await prisma.ExtendChat.create({
            data: {
              question: json.title,
              answer: json.answer,
              chatId: newChat.id
            }})
          return newChat;
        }
        else{
          const updateResponse = await prisma.Chat.update({
            where:{
              id:existingChat.id
            },
            data: {
              responses: {
                increment: 1, // Increment the responses field by 1
              },
            },
          })
          const extendChat = await prisma.ExtendChat.create({
            data: {
              question: json.question,
              answer: json.answer,
              chatId: existingChat.id
            }
          });
          return extendChat;

        }
  }
    else
    {
      return;
    }
  }catch(error){
    console.error("Error Writing Chat :", error);
    
  }
}



async function saveModalChat(json)
{
  try
  {
    const user = await prisma.user.findFirst({
      where:{
        email:json.email
      },
    })
    if(user)
    {
      const existingChat = await prisma.Chat.findFirst({
        where: {
          userId: user.id,
          webPageUrl: json.webPage
        },
      });
    
      const updateResponse = await prisma.Chat.update({
        where:{
          id:existingChat.id
        },
        data: {
          responses: {
            increment: 1, // Increment the responses field by 1
          },
        },
      })
      const extendChat = await prisma.ExtendChat.create({
        data: {
          question: json.question,
          answer: json.answer,
          chatId: existingChat.id
        }
      });
      return extendChat;

        
  }
    else
    {
      return;
    }
  }catch(error){
    console.error("Error Writing Chat :", error);
    
  }
}




async function SaveChat(json)
{
  try
  {

    const user = await prisma.user.findFirst({
      where:{
        email:json.email
      },
    })
    if(user)
    {
      const existingChat = await prisma.Chat.findFirst({
        where: {
          userId: user.id,
          webPageUrl: json.webPage
        },
      });
        if(!existingChat)
        {
          const newChat = await prisma.Chat.create({
            data:{
              webPageUrl : json.webPage,
              question: json.question,
              prompt:json.prompt,
              answer:json.answer,
              userId: user.id,
              responses : 1,
              title : json.question
            }
          });  
          const extendChatNew = await prisma.ExtendChat.create({
            data: {
              question: json.question,
              answer: json.answer,
              chatId: newChat.id
            }})
          return newChat;
        }
        else{
          const updateResponse = await prisma.Chat.update({
            where:{
              id:existingChat.id
            },
            data: {
              responses: {
                increment: 1, // Increment the responses field by 1
              },
            },
          })
          const extendChat = await prisma.ExtendChat.create({
            data: {
              question: json.question,
              answer: json.answer,
              chatId: existingChat.id
            }
          });
          return extendChat;

        }
  }
    else
    {
      return;
    }
  }catch(error){
    console.error("Error Writing Chat :", error);
    
  }
}


async function SaveShortCut(json)
{
  try
  {
    const user = await prisma.user.findFirst({
      where:{
        email:json.email
      },
    })  
    if(user)
    {
      const shortcut = await prisma.ShortCuts.findMany({
        where: { 
          userId: user.id,
        }
      });
      if (shortcut.length>0) {
        const updatedShortcuts = [];

        for (const newShortcut of json.obj) {
          const existingShortcut = shortcut.find(   
            (item) => item.name === newShortcut.description
          );
          if (existingShortcut) {
            const updatedShortcut = await prisma.ShortCuts.update({
              where: {
                id: existingShortcut.id
              },
              data: {
                keys: newShortcut.shortcut
              }
            });
      
            updatedShortcuts.push(updatedShortcut);
          }

        
      }
      return updatedShortcuts;
      } else {
        // Shortcut doesn't exist, create it
        var newShort =[]
        for (const myshortcut of json.obj) {
          var desc='';
          if(myshortcut.description == '')
          {
              desc='Activate/open extension popup';
          }
          else{
            desc = myshortcut.description;
          }
        const createdShortcut = await prisma.ShortCuts.create({
          data: {
            name: desc,
            keys: myshortcut.shortcut,
            userId: user.id
          }
        }); 
        newShort.push(createdShortcut)
      }
    
        return newShort;
      }
    }

  }catch(error){
    console.error("Error Writing Chat :", error);
    
  }
}


async function SaveNewChat(json)
{
  try
  {

    const updateResponse = await prisma.Chat.update({
      where:{
        id:json.selectedId
      },
      data: {
        responses: {
          increment: 1, // Increment the responses field by 1
        },
      },
    })


    const extendChatNew = await prisma.ExtendChat.create({
      data: {
        question: json.question,
        answer: json.answer,
        chatId: json.selectedId
      }})
    return extendChatNew;

  }catch(error){
    console.error("Error Writing Chat :", error);
    
  }
}

async function updateUserById(userId, updatedUser) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedUser,
    });
    return user;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function EditTitle(id , updatedTitle ) {
  try {
    const roleId = parseInt(id);
    const title = await prisma.Chat.update({
      where:{
          id: roleId,
        }, 
        data: {
          title: updatedTitle,
        },
    });
    return title;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function EditApi(email , updatedApi ) {
  try {

    const api = await prisma.user.update({
      where:{
          email: email,         
        },
        data:{
         gptKey:updatedApi.gptApiKey,
        }  
    })
    return api;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}

const getUserApiKey = async (email) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        gptKey: true,
      },
    });
      console.log(user.gptKey);
    // Return the subscription status or a default value if user is not found
    return user.gptKey ; // Assuming 0 is for no subscription
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};



const getGptVersion = async (email) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    });

    if(user)
    {
      const version = await prisma.Settings.findFirst({
        where: {
          userId: user.id,
        }
      });
      return version.gpt;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
  



const getUserSubscriptionStatus = async (email) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      // select: {
      //   isSubscribed: true,
      // },
    });

    // Return the subscription status or a default value if user is not found
    return user.isSubscribed ; // Assuming 0 is for no subscription
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


async function EditRole(id , updatedRole ) {
  try {
    const roleId = parseInt(id);
    const role = await prisma.Role.update({
      where:{
          id: roleId,         
        },
        data: updatedRole,
    })
    return role;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function AddRole(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if(!user)
    {
      return ;
    }
    const role = await prisma.Role.create({
      data: {
        name: data.name,
        prompt: data.prompt,
        reply:data.reply,
        userId: user.id,
      },
    
    })
    return role;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}




async function getUserChatRes(id) {
  try {
    const chat = await prisma.Chat.findFirst({
      where: {
        id:parseInt(id),   
      },
    });
    if(!chat)          
    {
      return ;
    }
    const chatRes = await prisma.ExtendChat.findMany({
      where:{
        chatId:chat.id
      }     
    })
    return chatRes;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}




async function getMyShortCut(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,   
      },
    });
    if(!user)          
    {
      return ;
    }
    const chat = await prisma.ShortCuts.findMany({
      where:{
        userId:user.id
      }     
    })
    return chat;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function getUserChat(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,   
      },
    });
    if(!user)          
    {
      return ;
    }
    const chat = await prisma.Chat.findMany({
      where:{
        userId:user.id
      },    
      orderBy: {
        timestamp: 'desc' // Order by timestamp in descending order
      }

    })
    return chat;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function getUserLiscenceKey(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,   
      }, 
    });   
    if(user)
    return(user.liscenceKey)
   return;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}


async function getUserGptApi(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,   
      }, 
    });   
    if(user)
    return(user.gptKey)
   return;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}




async function getUserEmail(data) {
  try {
    console.log("data",data);
    const user = await prisma.user.findFirst({
      where: {
        liscenceKey: data,   
      }, 
    });   
    console.log("user",user)
    if(user)
    return(user.email)
   return;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function getSetting(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,   
      },
    });
    if(user)
    {
      const userSetting = await prisma.Settings.findFirst({
        where: {
          userId: user.id,   
        }, 
    })
    return userSetting;
  }
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}





async function ChangeUserSetting(email , data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
      const upsertedSettings = await prisma.Settings.upsert({
        where: { userId: user.id }, 
        create: { userId: user.id,
                  gpt:data.gpt,
                  result: parseInt(data.textSize),
                  title : parseInt(data.titleSize),
                  showPrompt : data.hidePrompt,
                  color : data.bgcolor
                },
        update: {   
                  gpt:data.gpt,
                  result: parseInt(data.textSize),
                  title : parseInt(data.titleSize),
                  showPrompt : data.hidePrompt,
                  color : data.bgcolor 
                },
      });
    
    return upsertedSettings;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}


async function getPromptsWithReply(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,    
      },
    });
    if(!user)          
    {
      return 0;
    }
    const role = await prisma.Role.findMany({
      where:{
        userId:user.id,
        reply:"true",
      }     
    })
    return role;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}



async function getAllRole(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,
        
      },
    });
    if(!user)          
    {
      return 0;
    }
    const role = await prisma.Role.findMany({
      where:{
        userId:user.id,
      }     
    })
    return role;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}


async function getRole(data) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data,
        
      },
    });
    if(!user)          
    {
      return 0;
    }
    const role = await prisma.Role.findMany({
      where:{
        userId:user.id,
        reply:"false",
      }     
    })
    return role;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}


async function delChat(id ) {
  try {
    const ChatId = parseInt(id);
    const deldata = await prisma.ExtendChat.deleteMany({
      where:{
          chatId: ChatId,
        },
       
    })
    const deldata2 = await prisma.Chat.delete({
      where:{
          id: ChatId,
        },     
    })
    return deldata2;


  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}




async function delRole(id , userId) {
  try {
    const roleId = parseInt(id);
    const role = await prisma.Role.delete({
      where:{
          id: roleId,
        },
       
    })
    return role;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    throw error;
  }
}







module.exports = {
  getUserApiKey,
  getAllRole,
  getPromptsWithReply,
  getUserLiscenceKey,
  AddRole,
  getUserEmail,
  checkUser,
  getRole,
  EditRole,
  EditApi,
  EditTitle,
  delRole,
  SaveChat,
  SaveNewChat,
  getUserChat,
  getUserChatRes,
  getUserGptApi,
  getMyShortCut,
  getSetting,
  createUser,
  isUser,  
  getUserById,
  updateUserById,
  ChangeUserSetting,
  delChat,
  SaveShortCut,
  getUserSubscriptionStatus,
  getGptVersion,
  createNewChat,
  saveModalChat,
};
