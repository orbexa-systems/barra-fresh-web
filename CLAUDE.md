@AGENTS.md

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
3. Push de la rama y crear PR apuntando a **`develop`** automáticamente:
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
