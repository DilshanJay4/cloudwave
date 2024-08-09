"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    console.log("Database connected");

    const newUser = await User.create(user);
    console.log("User created:", newUser);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    console.log("Database connected");

    const user = await User.findOne({ clerkId: userId });
    console.log("User retrieved:", user);

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error retrieving user:", error);
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    console.log("Database connected");

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    console.log("User updated:", updatedUser);

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    console.log("Database connected");

    const userToDelete = await User.findOne({ clerkId });
    console.log("User to delete found:", userToDelete);

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    console.log("User deleted:", deletedUser);

    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.error("Error deleting user:", error);
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();
    console.log("Database connected");

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    );
    console.log("Credits updated:", updatedUserCredits);

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    console.error("Error updating credits:", error);
    handleError(error);
  }
}
