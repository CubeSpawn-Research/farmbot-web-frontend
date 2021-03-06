import { RegimensState,
    RegimensActionHandler,
    Regimen,
    RegimenItem,
    RegimenApiResponse } from "./interfaces";
import { ReduxAction } from "../interfaces";
import { stubs } from "./temporary_stubs";
import { randomColor } from "../util";

export function emptyRegimen(): Regimen {
    return {
        name: "Untitled Regimen",
        color: randomColor(),
        regimen_items: [],
        dirty: true
    };
}

let action_handlers: RegimensActionHandler = {
    DEFAULT: function(s, a) { return s; },
    /** Currently just a stub */
    EDIT_REGIMEN: function(s, a: any) {
        s = _.cloneDeep(s);
        let update = _.assign<{},
            Regimen>({},
            a.payload.regimen,
            a.payload.update,
            { dirty: true });
        s.all[s.current] = update;
        return s;
    },
    SAVE_REGIMEN_START: function(s, a) {
        s = _.cloneDeep(s);
        let update = _.assign<{}, Regimen>({}, a.payload, { dirty: false });
        s.all[s.current] = update;
        return s;
    },
    DELETE_REGIMEN_OK: function(s: RegimensState,
                             a: ReduxAction<Regimen>) {
        s = _.cloneDeep(s);
        s.all.splice(s.current, 1);
        s.current = (s.current <= 1) ? 0 : (s.current - 1);
        return s; // Lol this method is gross.
    },
    NEW_REGIMEN: function(s, a) {
        s = _.cloneDeep(s);
        s.all.push(emptyRegimen());
        return s;
    },
    SELECT_REGIMEN: function(s, a) {
        s = _.cloneDeep(s);
        s.current = a.payload;
        return s;
    },
    COMMIT_BULK_EDITOR: function(s: RegimensState, a: ReduxAction<any>) {
        s = _.cloneDeep(s);
        let { regimenItems, index } = a.payload;
        let ok = _.cloneDeep(regimenItems);
        let hmm = s.all[index].regimen_items;
        s.all[index].dirty = true;
        s.all[index].regimen_items = hmm.concat(ok);
        return s;
    },
    SAVE_REGIMEN_OK: function(s: RegimensState, a: ReduxAction<RegimenApiResponse>) {
        s = _.cloneDeep(s);
        let current = _.find<Regimen>(s.all, r => r.name === a.payload.name);
        _.assign(current, a.payload, {dirty: false}); // Merge props.
        return s;
    },
    REMOVE_REGIMEN_ITEM: function(s: RegimensState,
        a: ReduxAction<RegimenItem>) {
        s = _.cloneDeep(s);
        let list = s.all[s.current].regimen_items;
        let index = list.indexOf(a.payload);
        list.splice(index, 1);
        s.all[s.current].dirty = true;
        return s;
    },
    FETCH_REGIMENS_OK: function(s: RegimensState,
        a: ReduxAction<Regimen[]>){
      const nextState = _.cloneDeep<RegimensState>(s);
      nextState.all = _.cloneDeep<Regimen[]>(a.payload);
      return nextState;
    }
};

const initialState: RegimensState = {
    all: stubs,
    current: 0
};

export function regimensReducer(state = initialState,
    action: ReduxAction<any>) {
    let handler = (action_handlers[action.type] || action_handlers["DEFAULT"]);
    let result: RegimensState = handler(state, action);
    return result;
}
