import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Alert, TouchableOpacity } from 'react-native'
import { styles } from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut()
            Linking.openURL(Linking.createURL('/'))
          } catch (err) {
            console.error(JSON.stringify(err, null, 2))
          }
        },
      },
    ])
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={20} color="COLORS.text" />
    </TouchableOpacity>
  )
}