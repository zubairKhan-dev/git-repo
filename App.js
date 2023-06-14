import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async ()=> {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true
    }
  }
})

export default function App() {

  useEffect(()=> {

    async function configurePushNotifications() {
      const {status} = await Notifications.getPermissionsAsync();
      let finalStatus= status;
  
      if (finalStatus!== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync()
        finalStatus= status
      }
  
      if(finalStatus!== 'granted') {
        Alert.alert(
          'Permission required',
          'blablabla'
        )
        return
      }
  
      const pushToken= await Notifications.getExpoPushTokenAsync();
      console.log('pushToken', pushToken)
    }

    configurePushNotifications();

    if(Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT
      })
    }
    
  },[])

  useEffect(()=> {
    const subscription = Notifications.addNotificationReceivedListener((notification)=> {
      console.log('Notification recieved');
      console.log(notification)
      console.log(notification.request.content.data.userName)
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener((response)=> {
      console.log('Notification response recieved');
      console.log(response)
      console.log(response.notification.request.content.data.userName)
    });

    return ()=> {
      subscription.remove()
      subscription2.remove()
    }
  },[])

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'hey',
        body: 'blablablablablabl',
        data: {userName: 'Zubair'}
      },
      trigger: {
        seconds: 5
      }
    });
  }

  function sendPushNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: "ExponentPushToken[5lu_Q0BoHI_-SOn1hfOegm]",
        title: 'push',
        body: 'this is  a test'
      })
    })
  }

  return (
    <View style={styles.container}>
      <Button title='Schedule notification' onPress={scheduleNotificationHandler}/>
      <Button title='push notification' onPress={sendPushNotificationHandler}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
