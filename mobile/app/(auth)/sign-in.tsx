import {useState} from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { styles } from '@/assets/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err : any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors?.[0].code === 'form_param_format_invalid') {
        setError('Invalid email address')
      }else if (err.errors?.[0].code === 'form_password_incorrect') {
        setError('Invalid password')
      }else if (err.errors?.[0].code === 'form_identifier_not_found') {
        setError('Email not found')
      }else {
        setError('An error has occurred. Please try again.')
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <KeyboardAwareScrollView 
      style={{flex : 1, backgroundColor: COLORS.background}}
      contentContainerStyle={{ flexGrow : 1}}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      > 
      <View style={styles.container}>
        <Image source={require("../../assets/images/panda-signin.png")} style={styles.illustration}/>
        <Text style={styles.title}>Welcome Here!</Text>

        {error ?  (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}  
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          placeholderTextColor={COLORS.textLight}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignInPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}