const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
  valid?: boolean;
}

/**
 * Request a password reset link
 */
export async function requestPasswordReset(
  email: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to request password reset');
    }

    return data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
}

/**
 * Verify if a reset token is valid
 */
export async function verifyResetToken(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Invalid or expired token');
    }

    return data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

