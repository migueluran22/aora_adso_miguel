import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    plataform: 'co.sena.edu ',
    projectId: '66e9e0e000091b502ffb',
    databaseId: '666e9e292001dabac8b98',
    userCollectionId: '66e9e2be0025db80635f',
    videoCollectionId: '66e9e2dc0039946f4fcc',
    storageId: '666e9ef370018b076f166'
}

const {
  endpoint,
  plataform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = Config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(Config.endpoint)
    .setProject(Config.projectId)
    .setPlatform(Config.plataform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      ) 

      if (!newAccount) throw Error;
      

      const avatarUrl = avatars.getInitials(username);

      await signIn(email, password);

      const newUser = await databases.createDocument(
        Config.databaseId,
        Config.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
      
      return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      
      return session;
    } catch (error) {
      throw new Error(error);  
    }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      Config.databaseId,
      Config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}