# Subagente de documentación

El perfil `documentador` se define en [`.codex/agents/documentador.toml`](../.codex/agents/documentador.toml). Usa el modelo `gpt-5.6-luna` con razonamiento `medium` y escribe documentación Markdown en español dentro de `docs/`.

Su trabajo es explicar el comportamiento real del sistema y los cambios realizados, incluyendo flujos, archivos responsables, errores y pendientes. Verifica las afirmaciones en el código y actualiza los documentos existentes cuando corresponda.

## Cómo usarlo en Codex

Abre `web/` como proyecto en Codex. Esta carpeta contiene `app/`, `docs/` y `.codex/`; el perfil pertenece a ese proyecto. Un chat iniciado en la carpeta superior no descubre automáticamente la configuración dentro de `web/`. Pide la delegación directamente en el chat:

> Usa el subagente documentador con GPT-5.6 Luna para documentar los cambios del checkout. Verifica el código de app/ y, cuando corresponda, la API hermana en ../api/. Actualiza docs/checkout.md y espera su resultado antes de terminar.

Para incluirlo en una tarea de implementación:

> Implementa este cambio y, cuando la implementación esté estable, delega al subagente documentador con GPT-5.6 Luna la actualización de la documentación afectada en docs/. Revisa su resultado antes de terminar.

El agente principal debe proporcionarle el alcance, los archivos cambiados, las decisiones acordadas y los resultados de las comprobaciones. El documentador inspecciona el código, escribe la documentación y devuelve un resumen que el agente principal revisa.

Definir el perfil no inicia un proceso permanente: se ejecuta cuando Codex delega una tarea. Si el perfil recién creado no aparece en una sesión ya abierta, prueba una nueva sesión desde esta carpeta. Si no se reconoce el nombre, pide explícitamente un subagente con el modelo `gpt-5.6-luna` y las instrucciones del archivo del perfil.

## Delegación habitual

Para solicitar documentación como parte habitual de futuras tareas, puedes añadir esta instrucción al `AGENTS.md` que aplique al proyecto:

> Cuando una tarea cambie el comportamiento, los contratos o la configuración del sistema, y la implementación esté estable, delega la documentación afectada al subagente documentador usando gpt-5.6-luna con razonamiento medium. Entrégale el alcance y los resultados de validación, espera su resultado y revisa los documentos antes de finalizar.

Esta instrucción no se ha añadido automáticamente. El perfil limita sus ediciones a documentación mediante instrucciones; hereda los permisos de la sesión principal.

## Configuración y referencias

Las claves principales del perfil son:

```toml
name = "documentador"
description = "Documenta en español los cambios y flujos implementados en Skullframe."
model = "gpt-5.6-luna"
model_reasoning_effort = "medium"
developer_instructions = """
Verifica el comportamiento en el código y actualiza la documentación en docs/.
"""
```

El archivo instalado contiene las instrucciones completas. No hace falta cambiar el modelo del agente principal para elegir otro en el subagente.

Referencias: [subagentes y perfiles personalizados de Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents) y [modelo GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna).
