import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useRouter, useFocusEffect } from 'expo-router'
import { Alert, FlatList, Image, Text, TouchableOpacity, View, RefreshControl } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect, useState, useCallback } from 'react'
import { styles } from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '@/components/BalanceCard'
import { TransactionItem } from '@/components/TransactionItem'
import { COLORS } from '@/constants/colors'
import PageLoader from '@/components/PageLoader'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user?.id)
  const [refreshing, setRefreshing] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    loadData()
    setIsInitialLoad(false)
  }, [loadData])

  // Refresh data when screen comes into focus (e.g., after creating a transaction)
  useFocusEffect(
    useCallback(() => {
      if (!isInitialLoad) {
        loadData()
      }
    }, [loadData, isInitialLoad])
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTransaction(id)
          loadData()
        },
      },
    ])
  }

  if(isLoading && isInitialLoad) return <PageLoader />
  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>

          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image source={require('@/assets/images/react-logo.png')}/>
              <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>

        </View>

        {/* SUMMARY */}
        <BalanceCard summary={summary}/>

        {/* TRANSACTIONS */}
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

      </View>
      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.textLight]}
            tintColor={COLORS.textLight}
          />
        }
      />
    </View>
  )
}
