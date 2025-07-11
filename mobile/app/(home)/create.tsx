import { View, Text, Alert, TextInput, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useState } from 'react'
import { API_URL } from '@/constants/api'
import { styles } from '@/assets/styles/create.styles'
import { COLORS } from '@/constants/colors'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const categories = [
  { id: 'food', name: 'Food & Drinks', icon: 'fast-food' }, 
  { id: 'transport', name: 'Transportation', icon: 'car' },
  { id: 'shopping', name: 'Shopping', icon: 'cart' },
  { id: 'income', name: 'Income', icon: 'cash' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'bills', name: 'Bills', icon: 'receipt' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' },
]


const CreateScreen = () => {
  const router = useRouter()
  const { user } = useUser()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isExpense, setIsExpense] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert('Please enter a title')
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
      Alert.alert('Please enter a valid amount')
      return
    }
    if (!selectedCategory) return Alert.alert('Please select a category')

    setIsLoading(true)
    try {
      const formattedAmount = isExpense ?
      -Math.abs(parseFloat(amount)) :
      Math.abs(parseFloat(amount))

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          amount: formattedAmount,
          category: selectedCategory,
          type: isExpense ? 'expense' : 'income',
          user_id: user?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create transaction')
      }
      Alert.alert('Success', 'Transaction created successfully')
      router.back()
      
    }catch (error) {
      console.error('Error creating transaction:', error)
      Alert.alert('Error', 'Failed to create transaction')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Transaction</Text>
        <TouchableOpacity 
          onPress={handleCreate}
          style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>{isLoading ? 'Saving...' : 'Save'}</Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* EXPENSE/INCOME SELECTOR */}
        <View style={styles.typeSelector}>

          <TouchableOpacity 
          style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
          onPress={() => setIsExpense(false)}
          >
            <Ionicons 
              name="arrow-up-circle" 
              size={22} 
              color={!isExpense ? COLORS.white : COLORS.income} 
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          style={[styles.typeButton, isExpense && styles.typeButtonActive]}
          onPress={() => setIsExpense(true)}
          >
            <Ionicons 
              name="arrow-down-circle" 
              size={22} 
              color={isExpense ? COLORS.white : COLORS.expense} 
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
          </TouchableOpacity>
          
        </View>

        {/* AMOUNT INPUT */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* TITLE INPUT */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="transaction title"
              placeholderTextColor={COLORS.textLight}
            />
        </View>

        {/* CATEGORY TITLE */}
        <Text style={styles.sectionTitle}>
          <Ionicons
            name="pricetag-outline"
            size={16}
            color={COLORS.text}
          />Category
        </Text>

        {/* CATEGORY GRID */}
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons
                name={category.icon as any} 
                size={22} 
                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name && styles.categoryButtonTextActive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}

        </View>
      </View>

      {/* LOADING INDICATOR */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  )
}

export default CreateScreen

