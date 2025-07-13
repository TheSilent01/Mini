import React, { useState } from 'react';
import { Box, Input, Button, Text } from 'native-base';
import { supabase } from '../../../packages/api/supabaseClient';

export default function OnboardingScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else navigation.navigate('Home');
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Create your MinimalMind account</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} mb={4} />
      <Input placeholder="Password" value={password} onChangeText={setPassword} mb={4} type="password" />
      <Button onPress={handleSignup} isLoading={loading} mb={2}>Sign Up</Button>
      {error && <Text color="red.500">{error}</Text>}
    </Box>
  );
}
