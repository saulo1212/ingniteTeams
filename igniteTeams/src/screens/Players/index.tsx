import { Header } from '@components/Header'
import {Container} from './styles'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@components/ButtonIcon'

export function Players(){
    return(
        <Container>
            <Header showBackButton/>
            <Highlight title='Nome da turma' subtitle='Adicione e separe os times' />
            <ButtonIcon />
        </Container>
    )
}