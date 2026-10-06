/* Small, versioned local routine store. Exercise identities come from the catalogue. */
(function(root) {
  'use strict';
  const STORAGE_KEY = 'muscle-atlas.routine.v1';
  function createStore(exerciseIds, storage) {
    const valid = new Set(exerciseIds);
    let ids = null, history = [], message = '';
    function normalize(value) {
      // Allow an older catalogue to be larger than today's, while bounding malformed data.
      if (!Array.isArray(value) || value.length > 1024 || value.some(id => typeof id !== 'string')) throw new Error('Invalid routine');
      return [...new Set(value.filter(id => valid.has(id)))];
    }
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      if (raw) {
        if (raw.length > 131072) throw new Error('Routine record too large');
        const saved = JSON.parse(raw);
        if (saved?.version !== 1) throw new Error('Unsupported routine');
        ids = normalize(saved.ids);
        message = ids.length === saved.ids.length ? 'Routine restored from this device.' : 'Routine restored. Unavailable or repeated exercises were removed.';
      }
    } catch { message = 'Saved routine could not be read. Copy or print your next routine to keep a backup.'; }
    function save() {
      try {
        if (!storage) throw new Error('Storage unavailable');
        if (ids === null) storage.removeItem(STORAGE_KEY);
        else storage.setItem(STORAGE_KEY, JSON.stringify({version:1, ids}));
        message = ids === null ? 'Showing suggestions again.' : 'Routine saved on this device.';
      } catch { message = 'Changes kept for this visit. Copy or print to keep your routine.'; }
    }
    function commit(next) {
      if (JSON.stringify(ids) === JSON.stringify(next)) return false;
      history.push(ids === null ? null : [...ids]);
      if (history.length > 30) history.shift();
      ids = next;
      save();
      return true;
    }
    return {
      current: () => ids === null ? null : [...ids],
      message: () => message,
      canUndo: () => history.length > 0,
      add(id) { return valid.has(id) && !(ids || []).includes(id) ? commit([...(ids || []), id]) : false; },
      remove(id) { return ids?.includes(id) ? commit(ids.filter(item => item !== id)) : false; },
      move(id, offset) {
        if (!ids || ![-1,1].includes(offset)) return false;
        const from = ids.indexOf(id), to = from + offset;
        if (from < 0 || to < 0 || to >= ids.length) return false;
        const next = [...ids];
        [next[from],next[to]] = [next[to],next[from]];
        return commit(next);
      },
      replace(values) { return commit(normalize(values)); },
      clear() { return commit([]); },
      undo() {
        if (!history.length) return false;
        ids = history.pop();
        save();
        return true;
      }
    };
  }
  const api = {createStore, STORAGE_KEY};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RoutineModel = api;
})(globalThis);
