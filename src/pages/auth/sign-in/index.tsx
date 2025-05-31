import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';
import InputEmail from '@/components/commons/inputs/InputEmail';
import { Button } from '@/components/ui/button';
import InputMatricule from '@/components/commons/inputs/InputMatricule';
import InputPassword from '@/components/commons/inputs/InputPassword';
import ContentContainer from '@/components/commons/containers/ContentContainer';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [matriculeValid, setMatriculeValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const roles = [
    { label: 'Student', value: 'Student' },
    { label: 'Teacher', value: 'Teacher' },
  ];

  const isFormValid = () => {
    if (role === 'Teacher') {
      return emailValid && passwordValid;
    } else {
      return matriculeValid && passwordValid;
    }
  };

  const handleSignIn = () => {
    if (isFormValid()) {
      navigate('/course'); // Replace with your target route
    }
  };

  return (
    <ContentContainer>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div
            // className={`w-24 h-24 rounded-full mx-auto mb-6 ${colors.backgroundNeutral.replace('#', 'bg-')}`}
            className={`w-24 h-24 rounded-full mx-auto mb-6`}
          />
          <ThemedText className="text-xl font-semibold mb-4">Sign In As:</ThemedText>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-36 p-2 mb-6 text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 border-none rounded`}
            // className={`w-36 p-2 mb-6 text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 border-none rounded ${colors.neutralTextSecondary.replace('#', 'text-')}`}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
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
            variant='outline'
            className="mt-6 w-full"
            disabled={!isFormValid()}
            onClick={handleSignIn}
          >Sign In</Button>
        </div>
      </div>
    </div></ContentContainer>
  );
};

export default SignIn;