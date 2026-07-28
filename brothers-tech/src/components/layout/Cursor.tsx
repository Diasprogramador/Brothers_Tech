/**
 * O cursor é gerenciado inteiramente pelo hook `useCustomCursor`,
 * que cria e anima os elementos via DOM direto.
 * Este componente existe só para garantir que os estilos do cursor
 * sejam carregados uma vez na aplicação.
 */
import './Cursor.module.css';

export function CursorStyles() {
  return null;
}
