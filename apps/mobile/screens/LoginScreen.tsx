import React, { useState } from 'react';
import { Box, Input, Button, Text } from 'native-base';
import { supabase } from '../../../packages/api/supabaseClient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else navigation.navigate('Home');
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Log in to MinimalMind</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} mb={4} />
      <Input placeholder="Password" value={password} onChangeText={setPassword} mb={4} type="password" />
      <Button onPress={handleLogin} isLoading={loading} mb={2}>Log In</Button>
      {error && <Text color="red.500">{error}</Text>}
    </Box>
  );
}
