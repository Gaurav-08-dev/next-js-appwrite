import config from "@/conf/config";
import { Client, Account, ID } from "appwrite";

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

const appwriteClient = new Client();
appwriteClient
  .setEndpoint(config.appwriteURL)
  .setProject(config.appwriteProjectId);

export const appwriteAccount = new Account(appwriteClient);

export class AppwriteService {
  // create a new record of user in appwrite

  async createUserAccount({ email, password, name }: CreateUserAccount) {
    try {
      const userAccount = await appwriteAccount.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginUserAccount) {
    try {
      return await appwriteAccount.createEmailSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async getCurrentUser() {
    try {
      return appwriteAccount.get();
    } catch (error) {
      console.log("Get current user", error);
    }

    return null;
  }

  async logout() {
    try {
      return await appwriteAccount.deleteSession("current");
    } catch (error) {
      console.log("Logout error: ", error);
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;
