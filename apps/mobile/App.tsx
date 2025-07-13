import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Switch, Text, VStack, Input, Button, HStack, useToast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../packages/api/supabaseClient';
import { fetchPreferences, savePreferences } from '../../packages/lib/settings';
import { signOut, getCurrentUser } from '../../packages/lib/auth';
import type { UserPreferences, AuthUser } from '../../packages/lib/types';

export default function App() {
  const toast = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for form inputs
  const [cloudUrl, setCloudUrl] = useState('');

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      setIsLoading(true);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Fetch preferences from Supabase
        const userPrefs = await fetchPreferences(currentUser.id);
        if (userPrefs) {
          setPreferences(userPrefs);
          setCloudUrl(userPrefs.cloud_url || '');
          
          // Sync to AsyncStorage
          await AsyncStorage.setItem('user_preferences', JSON.stringify(userPrefs));
        }
      } else {
        // Load from AsyncStorage if no user
        const stored = await AsyncStorage.getItem('user_preferences');
        if (stored) {
          const storedPrefs = JSON.parse(stored);
          setPreferences(storedPrefs);
          setCloudUrl(storedPrefs.cloud_url || '');
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast.show({
        title: "Error",
        description: "Failed to load app data",
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;

    const updatedPrefs = { ...preferences, [key]: value };
    setPreferences(updatedPrefs);

    if (user) {
      // Save to Supabase
      const result = await savePreferences(user.id, { [key]: value });
      if (result.success) {
        await AsyncStorage.setItem('user_preferences', JSON.stringify(updatedPrefs));
        toast.show({
          title: "Settings saved",
          status: "success"
        });
      } else {
        toast.show({
          title: "Error",
          description: "Failed to save settings",
          status: "error"
        });
      }
    } else {
      // Save to AsyncStorage only
      await AsyncStorage.setItem('user_preferences', JSON.stringify(updatedPrefs));
    }
  };

  const handleCloudUrlSave = async () => {
    await updatePreference('cloud_url', cloudUrl || null);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setUser(null);
      setPreferences(null);
      await AsyncStorage.removeItem('user_preferences');
      toast.show({
        title: "Signed out successfully",
        status: "success"
      });
    }
  };

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <Box safeArea flex={1} justifyContent="center" alignItems="center" bg="white">
          <Text>Loading...</Text>
        </Box>
      </NativeBaseProvider>
    );
  }

  const darkMode = preferences?.dark_mode || false;
  const bgColor = darkMode ? 'coolGray.900' : 'white';
  const textColor = darkMode ? 'white' : 'black';

  return (
    <NativeBaseProvider>
      <Box safeArea p={6} flex={1} bg={bgColor}>
        <VStack space={6}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              MinimalMind
            </Text>
            {user && (
              <Button size="sm" variant="outline" onPress={handleSignOut}>
                Sign Out
              </Button>
            )}
          </HStack>

          {user && (
            <Box>
              <Text fontSize="sm" color={darkMode ? 'coolGray.400' : 'coolGray.600'}>
                Signed in as {user.email}
              </Text>
            </Box>
          )}

          {/* Appearance Section */}
          <Box>
            <Text fontWeight="semibold" mb={3} color={textColor} fontSize="lg">
              Appearance
            </Text>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color={textColor}>Dark Mode</Text>
              <Switch
                isChecked={preferences?.dark_mode || false}
                onToggle={(value) => updatePreference('dark_mode', value)}
              />
            </HStack>
          </Box>

          {/* AI Features Section */}
          <Box>
            <Text fontWeight="semibold" mb={3} color={textColor} fontSize="lg">
              AI Features
            </Text>
            <VStack space={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={textColor}>Smart Suggestions</Text>
                <Switch
                  isChecked={preferences?.ai_enabled || false}
                  onToggle={(value) => updatePreference('ai_enabled', value)}
                />
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={textColor}>Auto Book Covers</Text>
                <Switch
                  isChecked={preferences?.ai_covers || false}
                  onToggle={(value) => updatePreference('ai_covers', value)}
                />
              </HStack>
            </VStack>
          </Box>

          {/* Email Notifications Section */}
          <Box>
            <Text fontWeight="semibold" mb={3} color={textColor} fontSize="lg">
              Email Notifications
            </Text>
            <VStack space={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={textColor}>Reading Reminders</Text>
                <Switch
                  isChecked={preferences?.reading_reminders || false}
                  onToggle={(value) => updatePreference('reading_reminders', value)}
                />
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={textColor}>Weekly Progress</Text>
                <Switch
                  isChecked={preferences?.weekly_summary || false}
                  onToggle={(value) => updatePreference('weekly_summary', value)}
                />
              </HStack>
            </VStack>
          </Box>

          {/* Cloud Sync Section */}
          <Box>
            <Text fontWeight="semibold" mb={3} color={textColor} fontSize="lg">
              Cloud Sync
            </Text>
            <VStack space={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={textColor}>Enable Nextcloud Sync</Text>
                <Switch
                  isChecked={preferences?.cloud_sync || false}
                  onToggle={(value) => updatePreference('cloud_sync', value)}
                />
              </HStack>
              
              {preferences?.cloud_sync && (
                <VStack space={2}>
                  <Text fontSize="sm" color={darkMode ? 'coolGray.400' : 'coolGray.600'}>
                    Nextcloud URL
                  </Text>
                  <Input
                    placeholder="https://nextcloud.example.com/remote.php/webdav"
                    value={cloudUrl}
                    onChangeText={setCloudUrl}
                    bg={darkMode ? 'coolGray.800' : 'white'}
                    color={textColor}
                    borderColor={darkMode ? 'coolGray.600' : 'coolGray.300'}
                  />
                  <Button size="sm" onPress={handleCloudUrlSave}>
                    Save URL
                  </Button>
                </VStack>
              )}
            </VStack>
          </Box>

          {!user && (
            <Box mt={8} p={4} bg={darkMode ? 'coolGray.800' : 'coolGray.100'} rounded="md">
              <Text color={textColor} textAlign="center" mb={2}>
                Sign in to sync your settings across devices
              </Text>
              <Text fontSize="sm" color={darkMode ? 'coolGray.400' : 'coolGray.600'} textAlign="center">
                Your settings are saved locally for now
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}