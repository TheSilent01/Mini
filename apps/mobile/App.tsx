import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Switch, Text, VStack, Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiCovers, setAiCovers] = useState(true);
  const [readingReminders, setReadingReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [cloudUrl, setCloudUrl] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(v => v && setDarkMode(v === 'true'));
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  return (
    <NativeBaseProvider>
      <Box safeArea p={6} flex={1} bg={darkMode ? 'coolGray.900' : 'white'}>
        <Text fontSize="2xl" fontWeight="bold" mb={8} color={darkMode ? 'white' : 'black'}>Settings</Text>
        <VStack space={6}>
          <Box>
            <Text fontWeight="semibold" mb={2} color={darkMode ? 'white' : 'black'}>Appearance</Text>
            <Box flexDirection="row" alignItems="center">
              <Switch isChecked={darkMode} onToggle={() => setDarkMode(v => !v)} />
              <Text ml={2} color={darkMode ? 'white' : 'black'}>Dark Mode</Text>
            </Box>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2} color={darkMode ? 'white' : 'black'}>AI Features</Text>
            <Box flexDirection="row" alignItems="center">
              <Switch isChecked={aiEnabled} onToggle={() => setAiEnabled(v => !v)} />
              <Text ml={2} color={darkMode ? 'white' : 'black'}>Smart Suggestions</Text>
            </Box>
            <Box flexDirection="row" alignItems="center" mt={2}>
              <Switch isChecked={aiCovers} onToggle={() => setAiCovers(v => !v)} />
              <Text ml={2} color={darkMode ? 'white' : 'black'}>Auto Book Covers</Text>
            </Box>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2} color={darkMode ? 'white' : 'black'}>Email Notifications</Text>
            <Box flexDirection="row" alignItems="center">
              <Switch isChecked={readingReminders} onToggle={() => setReadingReminders(v => !v)} />
              <Text ml={2} color={darkMode ? 'white' : 'black'}>Send reading reminders</Text>
            </Box>
            <Box flexDirection="row" alignItems="center" mt={2}>
              <Switch isChecked={weeklySummary} onToggle={() => setWeeklySummary(v => !v)} />
              <Text ml={2} color={darkMode ? 'white' : 'black'}>Send weekly progress</Text>
            </Box>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2} color={darkMode ? 'white' : 'black'}>Cloud Sync</Text>
            <Box flexDirection="row" alignItems="center">
              <Switch isChecked={cloudSync} onToggle={() => setCloudSync(v => !v)} />
              <Text ml={2} color={darkMode ? 'white' : 'black'}>Enable Nextcloud Sync</Text>
            </Box>
            <Input mt={2} placeholder="Nextcloud URL" value={cloudUrl} onChangeText={setCloudUrl} bg={darkMode ? 'coolGray.800' : 'white'} color={darkMode ? 'white' : 'black'} />
          </Box>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}
