import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@components/ButtonIcon'
import { Input } from '@components/Input'
import {Filter} from '@components/Filter'
import {
    Container,
    Form, 
    HeaderList, 
    NumbersOffPlayers
} from './styles'
import { Alert, FlatList, TextInput } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { PlayerCard } from '@components/PlayerCard'
import { ListEmpty } from '@components/ListEmpty'
import { Button } from '@components/Button'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppError } from '@utils/appError'
import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam'
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup'
import { groupRemoveByName } from '@storage/group/groupRemoveByName'

type RouteParams = {
    group: string
}

export function Players(){

    const [newPlayerName, setNewPlayerName] = useState('')
    const [team, setTeam] = useState('TIME A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

    const route = useRoute()
    const navigation = useNavigation()

    const {group} = route.params as RouteParams

    const newPlayerNameInputRef = useRef<TextInput>(null)

    async function handleAddPlayer() {

        if(newPlayerName.trim().length === 0){
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa')
        }

        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {

            await playerAddByGroup(newPlayer, group)
            fetchPlayersByTeam()
            
        } catch (error) {
            if(error instanceof AppError){
                Alert.alert('Nova pessoa', error.message)
            }else{
                console.log(error)  
                Alert.alert('Nova pessoa', 'Não foi possivel adicionar')
                
            }
        }

    }

    async function fetchPlayersByTeam(){
        try {

            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            newPlayerNameInputRef.current?.blur();
            setNewPlayerName('')
            setPlayers(playersByTeam)
            
        } catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possivel carregar as pessoas')
        }
    }

    async function handlePlayerRemove(playerName: string){
        try {

            await playerRemoveByGroup(playerName,group)
            fetchPlayersByTeam()
            
        } catch (error) {
            console.log(error)
            Alert.alert('Remover Pessoa', 'Não foi possivel remover a pessoa')
        }
    }

    async function groupRemove() {
        
        try {

            await groupRemoveByName(group)
            navigation.navigate('groups')
            
        } catch (error) {
            console.log(error)
            Alert.alert('Remove grupo', 'Não foi possivel remover grupo')
        }
    }

    async function handleGroupRemove(){
        Alert.alert(
            'remover', 
            'Deseja remover o grupo',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => groupRemove()}
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam()
    },[team])

    return(
        <Container>
            <Header showBackButton/>

            <Highlight 
                title={group} 
                subtitle='Adicione e separe os times' 
            />

            <Form>
                <Input 
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                    inputRef={newPlayerNameInputRef}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />

                <ButtonIcon 
                    icon='add' 
                    onPress={() => handleAddPlayer()}
                />

            </Form>

            <HeaderList >

                <FlatList 
                    data={['TIME A', 'TIME B']}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <Filter 
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumbersOffPlayers>
                    {players.length}
                </NumbersOffPlayers>

            </HeaderList>

            <FlatList 
                data={players}
                keyExtractor={item => item.name}
                renderItem={({item}) => (
                    <PlayerCard 
                        name={item.name} 
                        onRemove={() => handlePlayerRemove(item.name)} 
                    />
                )}
                ListEmptyComponent={() => <ListEmpty message='Não ha pessoas nesse time' />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    {paddingBottom:100},
                    players.length === 0  && {flex:1}
                ]}
            />

            <Button
                title='Remover Turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />
            
        </Container>
    )
}