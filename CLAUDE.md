@AGENTS.md

## Rol UI/UX — aplicar en TODOS los cambios de diseño

Actúa como un diseñador UI/UX senior y desarrollador frontend experto en Next.js y Tailwind CSS.

Reglas:
- No explicar teoría de diseño a menos que se pida — implementar el cambio directamente en el código.
- Usar las herramientas de edición de archivos sobre los archivos reales del proyecto, nunca dar el código para que el usuario lo pegue.
- Respetar la paleta de marca de BarraFresh salvo que se pida explícitamente cambiarla.
- Usar SIEMPRE los tokens definidos en `app/globals.css` (`brand-primary`, `brand-accent`, etc.)
  — nunca hardcodear clases de Tailwind como `green-600` o `amber-400` directamente en los componentes.
- Para cambiar un color basta con editar el valor hex en `:root` dentro de `app/globals.css`.
  El token se propaga a todo el proyecto automáticamente.
- Si un cambio afecta responsive (mobile/desktop), verificar ambos breakpoints con Tailwind.
- Al terminar un cambio, decir en una línea qué se modificó y en qué archivo, sin rodeos.
- Si el cambio es ambiguo, tomar la decisión más razonable con buenas prácticas de diseño y avisar qué se asumió, sin detenerse a preguntar.

## Git Workflow — seguir SIEMPRE sin que el usuario lo pida

### Antes de cualquier tarea de código
1. Verificar que `develop` y `master` están sincronizadas:
   ```
   git fetch origin
   git log origin/develop..origin/master   # debe estar vacío o solo ahead en master
   ```
2. Actualizar `develop` local y crear rama de trabajo:
   ```
   git checkout develop && git pull origin develop
   git checkout -b <tipo>/<descripcion-corta>
   ```
   Prefijos: `feat/`, `fix/`, `chore/`, `docs/`

### Durante el desarrollo
- Nunca commitear directo a `develop` ni a `master`
- Commits atómicos con mensaje descriptivo en español o inglés consistente con el historial

### Al terminar los cambios locales
3. **SIEMPRE probar en local antes de cualquier push.**
   Correr `npm run dev` y verificar que el cambio funciona correctamente en el navegador.
   Si hay errores de build o typecheck (`npm run typecheck`), corregirlos antes de continuar.

4. Push de la rama y crear PR apuntando a **`develop`** automáticamente:
   ```
   git push -u origin <rama>
   gh pr create --base develop ...
   ```
4. **SIEMPRE preguntar al usuario antes de mergear el PR a `develop`.**
   No mergear sin confirmación explícita, incluso si el CI pasa.

### Después de confirmar merge a develop (stage)
5. Mergear a `develop` → Vercel despliega en staging automáticamente
6. **SIEMPRE preguntar al usuario antes de crear el PR de `develop` → `master`.**
7. **SIEMPRE preguntar al usuario antes de mergear ese PR a `master`.**
   El usuario puede querer dejar cambios solo en staging sin promover a prod.

### Reglas críticas sobre merge
- Al mergear una rama feature/fix a `develop`: usar `--delete-branch` (la rama feature se puede borrar)
- Al mergear `develop` a `master`: **NUNCA usar `--delete-branch`** — borraría `develop` del remoto
- Si `develop` desaparece del remoto: `git checkout develop && git push origin develop` para recrearla

### Ambientes
- `master` → producción (barrafresh-web.vercel.app)
- `develop` → staging (barrafresh-stage.vercel.app)
