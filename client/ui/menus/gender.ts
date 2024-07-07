import { CharacterStore } from "state/character-store";
import { Menu, NativeUI } from "ui"
import type { Character } from "constants/character";
import { RefreshModel } from "ped";

export function addMenuGender(parentMenu: Menu, store: CharacterStore) {
    const genders: readonly [Character['gender'], Character['gender']] = [
        "Male",
        "Female"
    ] as const;
 
    const {character} = store;
	const genderIndex = character.gender === "Female" ? 1 : 0;

    const genderItem = NativeUI.CreateListItem("Sex", genders, genderIndex, "Select the gender of your Character.");
    NativeUI.Menu.AddItem(parentMenu, genderItem)

    NativeUI.setEventListener(parentMenu, 'OnListChange', (sender, item, index) => {
        // Lua is 1-indexed
        if(typeof index === 'number') {
            index -= 1;
        }
        console.log('OnListChange', item, genderItem, index);
        if(item === genderItem) {
            console.log('OnListChange', genders[index]);
            store.actions.setGender(genders[index]);
            store.actions.setOgd(genders[index].substring(0, 1) as "M" | "F");
            store.actions.setLcgd(genders[index].toLowerCase() as Lowercase<typeof genders[number]>)
            // oldmdhash = mdhash
            if(genders[index as keyof typeof genders] == "Male") {
                store.mdhash = GetHashKey("mp_m_freemode_01")
            } else {
                store.mdhash = GetHashKey("mp_f_freemode_01")
            }
            
            RequestModel(store.mdhash)
            store.actions.setResemblance(1.0 - character.resemblance);
            store.actions.setSkintone(1.0 - character.resemblance);
            RefreshModel()
        }
    })
}