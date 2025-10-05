
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  inputStyles, 
  spacing, 
  borderRadius 
} from '../../styles/commonStyles';
import SimpleBottomSheet from '../../components/BottomSheet';

interface Contact {
  id: string;
  name: string;
  phone: string;
  autoJam: boolean;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'John Doe', phone: '+1 (555) 123-4567', autoJam: true },
    { id: '2', name: 'Jane Smith', phone: '+1 (555) 987-6543', autoJam: false },
    { id: '3', name: 'Mike Johnson', phone: '+1 (555) 456-7890', autoJam: true },
    { id: '4', name: 'Sarah Wilson', phone: '+1 (555) 321-0987', autoJam: false },
  ]);
  
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const toggleAutoJam = (contactId: string) => {
    console.log('Toggling auto jam for contact:', contactId);
    setContacts(contacts.map(contact =>
      contact.id === contactId
        ? { ...contact, autoJam: !contact.autoJam }
        : contact
    ));
  };

  const addContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      autoJam: false,
    };

    console.log('Adding new contact:', newContact);
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const removeContact = (contactId: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            console.log('Removing contact:', contactId);
            setContacts(contacts.filter(contact => contact.id !== contactId));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.lg,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <Text style={[commonStyles.title, { textAlign: 'left', marginBottom: spacing.sm }]}>
            Contacts
          </Text>
          <Text style={commonStyles.bodySecondary}>
            Manage auto-jam settings for your contacts
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.md }}>
          <View style={{ position: 'relative' }}>
            <View style={[inputStyles.iconContainer, { left: spacing.md }]}>
              <Icon name="search" size={20} color={colors.textLight} />
            </View>
            <TextInput
              style={[inputStyles.input, inputStyles.inputWithIcon]}
              placeholder="Search contacts..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Contacts List */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {filteredContacts.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.center, { paddingVertical: spacing.xxl }]}>
              <Icon name="people-outline" size={48} color={colors.textLight} />
              <Text style={[commonStyles.subtitle, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
                {searchQuery ? 'No contacts found' : 'No contacts yet'}
              </Text>
              <Text style={[commonStyles.caption, { textAlign: 'center' }]}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Add contacts to manage auto-jam settings'
                }
              </Text>
            </View>
          ) : (
            filteredContacts.map((contact) => (
              <View key={contact.id} style={[commonStyles.card, { marginBottom: spacing.md }]}>
                <View style={commonStyles.row}>
                  <View style={{ flex: 1 }}>
                    <View style={commonStyles.centerRow}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: contact.autoJam ? colors.primary : colors.backgroundAlt,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.md,
                      }}>
                        <Text style={[commonStyles.body, { 
                          color: contact.autoJam ? colors.background : colors.text,
                          fontWeight: '600'
                        }]}>
                          {contact.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[commonStyles.body, { fontWeight: '600', marginBottom: 2 }]}>
                          {contact.name}
                        </Text>
                        <Text style={commonStyles.caption}>
                          {contact.phone}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={commonStyles.centerRow}>
                    <View style={{ alignItems: 'center', marginRight: spacing.md }}>
                      <Text style={[commonStyles.caption, { marginBottom: spacing.xs }]}>
                        Auto Jam
                      </Text>
                      <Switch
                        value={contact.autoJam}
                        onValueChange={() => toggleAutoJam(contact.id)}
                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                        thumbColor={contact.autoJam ? colors.primary : colors.textLight}
                      />
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => removeContact(contact.id)}
                      style={{
                        padding: spacing.sm,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <Icon name="trash-outline" size={20} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {contact.autoJam && (
                  <View style={[commonStyles.badge, { 
                    marginTop: spacing.sm,
                    backgroundColor: colors.success 
                  }]}>
                    <Text style={commonStyles.badgeText}>
                      ⚡ Auto-jam enabled
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Add Contact Button */}
        <View style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={() => setShowAddContact(true)}
          >
            <View style={commonStyles.centerRow}>
              <Icon name="person-add" size={20} color={colors.background} />
              <Text style={[buttonStyles.primaryText, { marginLeft: spacing.sm }]}>
                Add Contact
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Add Contact Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={showAddContact}
          onClose={() => setShowAddContact(false)}
        >
          <View style={{ padding: spacing.md }}>
            <Text style={[commonStyles.subtitle, { marginBottom: spacing.lg, textAlign: 'center' }]}>
              Add New Contact
            </Text>
            
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Name</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="Enter contact name"
                placeholderTextColor={colors.textLight}
                value={newContactName}
                onChangeText={setNewContactName}
              />
            </View>
            
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Phone Number</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textLight}
                value={newContactPhone}
                onChangeText={setNewContactPhone}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={commonStyles.row}>
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginRight: spacing.sm }]}
                onPress={() => setShowAddContact(false)}
              >
                <Text style={buttonStyles.outlineText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1, marginLeft: spacing.sm }]}
                onPress={addContact}
              >
                <Text style={buttonStyles.primaryText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SimpleBottomSheet>
      </View>
    </SafeAreaView>
  );
}
