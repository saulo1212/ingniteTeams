import { Header } from '@components/Header'
import {Highlight} from '@components/Highlight'
import {GroupCard} from '@components/GroupCard'
import {Container} from './styles'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { ListEmpty } from '@components/ListEmpty'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'

export default function Groups() {

  const navigation = useNavigation()

  const [groups,setGroups] = useState<string[]>( [])

  function handleNewGroup(){
    navigation.navigate('new')
  }

  return (
    <Container >

      <Header  />

      <Highlight 
        title='Turmas'
        subtitle='Jogue com a sua turma'
      />

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <GroupCard title={item}/>
        )}

        contentContainerStyle={groups.length === 0 && {flex:1}}
        ListEmptyComponent={() => <ListEmpty message='Cadastre uma turma' />}
      />

      <Button 
        title='Cria nova turma'
        onPress={handleNewGroup}
      />

    </Container>
  );
}

