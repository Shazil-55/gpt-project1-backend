const userModel = require("../Models/User");
const jwt = require('jsonwebtoken');


const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const history = [];

async function GPTCall(modelName , token , givenPrompt)
{ 
  const messages = [];
  
  for (const [givenPrompt, completion_text] of history) {
    messages.push({ role: "user", content: givenPrompt });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: givenPrompt });

  try {
    const completion = await openai.createChatCompletion({
      model: modelName || "gpt-3.5-turbo",
      messages: messages,
      max_tokens:token
    });                         

    const completion_text = completion.data.choices[0].message.content;

    history.push([givenPrompt, completion_text]);

    // res.send(completion_text);
    return completion_text

    }catch(err)
    {
      // console.log("error while geenerating response is ", err)
      return "Use Correct verion of Gpt or use correct API"
    }
}

async function generateGptResponse (req,res,next) {

  try{

    const email = req.query.email;
    const givenPrompt = req.body.prompt;
    const token = req.body.tokens;
    const subId = await userModel.getUserSubscriptionStatus(email);

    var mymodel =""
    const getGPTVersion = await userModel.getGptVersion(email);
    if( getGPTVersion == 'gpt-3.5')mymodel=null
    if( getGPTVersion == 'gpt-4')mymodel='gpt-4'



    if(subId==2)
    {
      const result =await GPTCall(mymodel,token ,givenPrompt)
      res.status(200).json( result)
    }
    else if (subId ==1 || subId == 3)
    {
     var UserGptKey =  await userModel.getUserApiKey(email)
     if(UserGptKey)
     {
      try{
      const result =await GPTCall(mymodel,token ,givenPrompt)

        res.status(200).json( result)
      }catch(error)
      {
        res.status(200).json( "Please add Valid api key to get response from AI")
      }
      }
      else{
        res.status(200).json( "Please add your api key to get response from AI")
      }

    }
    else{
      res.status(200).json( "Something Went Wrong .Please check your network connection or add api key from the KEYS option in Users dashboard or if you dont have key than change your plan to growth")
 
    }
  }
  catch(error)
  {
    console.log(error);
  }
}



async function loginuser(req, res , next) {
  try {
    // console.log("login function is called " , req.body);
    const json =req.body;
    const liscenceKey =req.body.liscenceKey;
    const existingUser = await userModel.isUser(req.body.email);
    const secretKey = process.env.JWT_SECRET_KEY;
    if(!existingUser)    
    {
           const user = await userModel.createUser(json);
            const token = jwt.sign({ userId: user.id }, secretKey);
            res.status(201).json({ token , liscenceKey});
    }
    else 
    {
      const liscenceKey = existingUser.liscenceKey
        const token = jwt.sign({ userId: existingUser.id }, secretKey);
        res.status(201).json({ token  , liscenceKey });
    }      
  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}


async function SaveRole(req, res , next) {
  try {
    const addRole = await userModel.AddRole(req.body);
    return addRole;
  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}


async function saveNewChat(req, res , next) {
  try {
    // const email = req.body.email;
    const saveChatData = await userModel.SaveNewChat(req.body);
    //const addRole = await userModel.AddRole(req.body);
    res.status(201).json(saveChatData );
  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}


async function SaveShortCuts(req, res , next) {
  try {
    // const email = req.body.email;
    const SaveShortCut = await userModel.SaveShortCut(req.body);
    res.status(200).json(SaveShortCut)
    return SaveShortCut;
  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}



async function createNewChat(req, res , next) {
  try {
    const createNewChat = await userModel.createNewChat(req.body);
    res.status(200).json({createNewChat});

  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}



async function saveExtendChat(req, res , next) {
  try {
    const saveChatData = await userModel.saveModalChat(req.body);
    res.status(200).json(saveChatData)

  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}




async function saveChat(req, res , next) {
  try {
    const saveChatData = await userModel.SaveChat(req.body);
    res.status(200).json(saveChatData)

    return saveChatData;
  } catch (error) {   
    next();
    res.status(500).json({ error: error.message });
  }
}



async function getReplyPrompts(req, res , next) {
  try {
    const email = req.query.email;

    const getRole = await userModel.getPromptsWithReply(email);
    res.status(200).json(getRole)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next(); 
  }
}



async function getAllPrompts(req, res , next) {
  try {
    const email = req.query.email;

    const getRole = await userModel.getAllRole(email);
    res.status(200).json(getRole) 
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();   
  }
}


async function getPrompts(req, res , next) {
  try { 
    const email = req.query.email;

    const getRole = await userModel.getRole(email);
    res.status(200).json(getRole)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}


async function getKey(req, res , next) {
  try {
    const email = req.query.email;

    const getUserGptApi = await userModel.getUserLiscenceKey(email);
    res.status(200).json(getUserGptApi)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}
 

async function getGptApi(req, res , next) {
  try {
    const email = req.query.email;

    const getUserGptApi = await userModel.getUserGptApi(email);
    res.status(200).json(getUserGptApi)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}

async function getEmail(req, res , next) { 
  try {     
    const mykey = req.query.key;

    const getUserEmail = await userModel.getUserEmail(mykey); 
    console.log(getUserEmail);
    res.status(200).json(getUserEmail)
  } catch (error) {   
    res.status(500).json({ error: error.message });  
    next();
  }
}

async function getSetting(req, res , next) {
  try {
    const email = req.query.email;

    const getSet = await userModel.getSetting(email);
    res.status(200).json(getSet)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}


async function getChatsResponse(req, res , next) {
  try {
    const id = req.query.id;
    const getUserChatRes = await userModel.getUserChatRes(id);
    res.status(200).json(getUserChatRes)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}


async function getChats(req, res , next) {
  try {
    const email = req.query.email;
    const getUserChat = await userModel.getUserChat(email);
    res.status(200).json(getUserChat)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}

async function getShortCuts(req, res , next) {
  try {
    const email = req.query.email;
    const getSC = await userModel.getMyShortCut(email);
    res.status(200).json(getSC)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}



async function setSetting(req, res , next) {
  try {
    const email = req.query.email;
    const data = req.body;
    const getUserChat = await userModel.ChangeUserSetting(email , data);
    res.status(200).json(getUserChat)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}



async function deleteChat(req, res , next) {
  try {
    const id = req.query.id;
    const delChat = await userModel.delChat(id);
    res.status(200).json(delChat)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}


async function delPrompts(req, res , next) {
  try {
    const id = req.query.id;
    const userId = req.query.userId;
    const delRole = await userModel.delRole(id , userId);
    res.status(200).json(delRole)
  } catch (error) {   
    res.status(500).json({ error: error.message });
    next();
  }
}




async function updateTitle(req, res , next) {
  try {
    const id = req.query.id;
    const EditTitle = await userModel.EditTitle(id,req.body.title);
    res.status(200).json(EditTitle)
  } catch (error) {   
    console.log(error.message) ;
    res.status(500).json({ error: error.message });
    next();
  }
}


async function updateGptApi(req, res , next) {
  try {
    const email = req.query.email;
    const EditApi = await userModel.EditApi(email,req.body);
    res.status(200).json(EditApi)
  } catch (error) {   
    console.log(error.message) ;
    res.status(500).json({ error: error.message });
    next();
  }
}


async function EditPrompts(req, res , next) {
  try {
    const id = req.query.id;
    const EditRole = await userModel.EditRole(id,req.body);
    res.status(200).json(EditRole)
  } catch (error) {   
    console.log(error.message) ;
    res.status(500).json({ error: error.message });
    next();
  }
}

async function validUser(req,res,next){
  try {
   const key = req.query.key;
   const checkUser = await userModel.checkUser(key);
   res.status(200).json(checkUser)
 } catch (error) {   
   res.status(500).json({ error: error.message });
   next();
 }
}



// Export the functions to be used in the routes
module.exports = {
  generateGptResponse,
  getGptApi,
  getKey,
  getEmail,
  validUser,
  saveChat,
  SaveShortCuts,
  setSetting,
  getSetting,
  getChats,
  getReplyPrompts,
  getAllPrompts,
  getChatsResponse,
  EditPrompts,
  delPrompts,
  deleteChat,
  getPrompts,
  getShortCuts,
  SaveRole,
  saveExtendChat,
  saveNewChat,
  loginuser,
  updateTitle,
  updateGptApi,
  createNewChat
};
