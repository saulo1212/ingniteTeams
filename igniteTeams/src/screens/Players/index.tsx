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
import { Alert, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { PlayerCard } from '@components/PlayerCard'
import { ListEmpty } from '@components/ListEmpty'
import { Button } from '@components/Button'
import { useRoute } from '@react-navigation/native'
import { AppError } from '@utils/appError'
import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam'
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'

type RouteParams = {
    group: string
}

export function Players(){

    const [newPlayerName, setNewPlayerName] = useState('')
    const [team, setTeam] = useState('TIME A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

    const route = useRoute()

    const {group} = route.params as RouteParams

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
            setPlayers(playersByTeam)
            
        } catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possivel carregar as pessoas')
        }
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
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
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
                    <PlayerCard name={item.name} onRemove={() => {}} />
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
            />
            
        </Container>
    )
}