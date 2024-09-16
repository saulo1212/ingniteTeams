import AsyncStorage from '@react-native-async-storage/async-storage'
import { GROUP_COLLECTION } from '@storage/storageConfig';
import { groupsGetAll } from './groupsGetAll';
import { AppError } from '@utils/appError';

export async function groupCreate(newGroup: string){

    try{

        const storedGroups = await groupsGetAll()

        const groupAlreadyExists = storedGroups.includes(newGroup)

        if(groupAlreadyExists){
            throw new AppError(`Ja existe o grupo cadastrado com esse nome  ${newGroup}`)
        }

        const storage = JSON.stringify([...storedGroups, newGroup])

        await AsyncStorage.setItem(GROUP_COLLECTION, storage)
        
    }catch(error){
        
        throw error;
    }
}