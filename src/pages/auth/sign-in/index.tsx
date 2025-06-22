
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';
import InputEmail from '@/components/commons/inputs/InputEmail';
import InputMatricule from '@/components/commons/inputs/InputMatricule';
import InputPassword from '@/components/commons/inputs/InputPassword';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/api';
import { useAuth } from '@/context/auth';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { mutate: loginMutate, isPending: isLoading, error } = useLogin();
  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [matriculeValid, setMatriculeValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const from = location.state?.from?.pathname || '/courses';

  const roles = [
    { label: 'Student', value: 'Student' },
    { label: 'Teacher', value: 'Teacher' },
  ];

  const isFormValid = () => {
    return role === 'Teacher' ? emailValid && passwordValid : matriculeValid && passwordValid;
  };

  const handleSignIn = () => {
    if (!isFormValid()) return;

    const identifier = role === 'Teacher' ? email : matricule;
    loginMutate(
      { identifier, password, role },
      {
        onSuccess: (data) => {
          login({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: { userId: data.user.userId, role: data.user.role },
          });
          navigate(from, { replace: true });
        },
      }
    );
  };

  return (
    <ContentContainer>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-gray-600" />
            <ThemedText className="text-xl font-semibold mb-4">Sign In As:</ThemedText>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-36 p-2 mb-6 text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 border-none rounded"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {error && <p className="text-red-500 text-center">{error.message || 'Login failed'}</p>}
            {role === 'Teacher' ? (
              <>
                <InputEmail
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  onValidChange={setEmailValid}
                  placeholder="Enter your email"
                />
                <InputPassword
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  onValidChange={setPasswordValid}
                  placeholder="Enter your password"
                />
              </>
            ) : (
              <>
                <InputMatricule
                  label="Matricule"
                  value={matricule}
                  onChangeText={setMatricule}
                  onValidChange={setMatriculeValid}
                  placeholder="Enter your matricule (e.g., fe12a345)"
                />
                <InputPassword
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  onValidChange={setPasswordValid}
                  placeholder="Enter your password"
                />
              </>
            )}
            <Button
              variant="outline"
              className="mt-6 w-full"
              disabled={!isFormValid() || isLoading}
              onClick={handleSignIn}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default SignIn;