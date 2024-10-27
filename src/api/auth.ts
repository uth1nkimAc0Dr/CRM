const BASE_URL = 'https://easydev.club/api/v1';

import type {
  UserRegistration,
  AuthData,
  RefreshToken,
  Profile,
  ProfileRequest,
  PasswordRequest,
  Token,
} from '@/types/authInterfaces';

export const createProfile = async (
  newProfile: UserRegistration,
): Promise<Profile | any> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    });

    if (!response.ok) {
      throw new Error(`createProfileError : ${response.status}`);
    }
  } catch (error) {
    console.log(`createProfileError is ${error}`);
    throw error;
  }
};
