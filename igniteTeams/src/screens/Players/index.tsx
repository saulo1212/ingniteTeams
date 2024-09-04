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
import { FlatList } from 'react-native'
import { useState } from 'react'

export function Players(){

    const [team, setTeam] = useState('TIME A')
    const [players, setPlayers] = useState([])

    return(
        <Container>
            <Header showBackButton/>

            <Highlight 
                title='Nome da turma' 
                subtitle='Adicione e separe os times' 
            />

            <Form>
                <Input 
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                />

                <ButtonIcon icon='add' />

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

            

            
        </Container>
    )
}