import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { supabase } from '../supabaseClient';

export default function Onboarding({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) navigation.navigate('Dashboard');
  };

  return (
    <View>
      <Text>Welcome to Elev8</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}