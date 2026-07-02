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
3. Push de la rama:
   ```
   git push -u origin <rama>
   ```
4. Crear PR apuntando a **`develop`** (nunca directo a master)
   - Título claro, descripción con qué cambia y por qué
   - Esperar aprobación antes de mergear

### Después de merge a develop (stage)
5. Verificar que el deploy en Vercel staging terminó sin errores
6. Una vez validado en staging, crear PR de `develop` → `master` para producción

### Ambientes
- `master` → producción (barrafresh-web.vercel.app)
- `develop` → staging (barrafresh-stage.vercel.app)
