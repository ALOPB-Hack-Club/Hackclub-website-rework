---
layout: ../../layouts/DocumentLayout.astro
title: Analiza kodu pluginów
---

# Analiza kodu pluginów

To jest kod w Kotlinie, który odpowiada za dodanie do serwera Minecrafta komendy `jump`, która sprawia, że gracz wybija się w powietrze.

```kotlin
package com.hackclub.alopb.plugintemplate  
  
import org.bukkit.command.Command  
import org.bukkit.command.CommandExecutor  
import org.bukkit.command.CommandSender  
import org.bukkit.entity.Player  
import org.bukkit.plugin.java.JavaPlugin  
import org.bukkit.util.Vector  
  
class Plugin_template : JavaPlugin() {  
    override fun onEnable() {  
        // Plugin startup logic  
        getCommand("jump")?.setExecutor(JumpCommand())  
    }  
  
    override fun onDisable() {  
        // Plugin shutdown logic  
    }  
}  
  
// tutaj będzie to, co się wykona po wpisaniu komendy  
class JumpCommand: CommandExecutor {  
    override fun onCommand(sender: CommandSender, p1: Command, p2: String, p3: Array<out String>?): Boolean {  
        if (sender is Player) {  
            sender.velocity = sender.velocity.add(Vector(0.0, 5.0, 0.0))  
        }  
  
		return true  
    }  
}
```

Jest to 30 linijek, z których można bardzo dużo wyciągnąć.

Kod jest napisany w Kotlinie, języku reprezentującego paradygmat OOP - Object oriented programming. Oznacza to, że dużo rzeczy w kodzie obraca się wokół klas, metod i interfejsów.

Żeby plugin mógł w ogóle wchodzić w interakcję z Minecraftem, musi korzystać z biblioteki takiej, jak Bukkit. W tym wypadku widać to po licznych importach:
```kotlin
import org.bukkit.command.Command  
import org.bukkit.command.CommandExecutor  
import org.bukkit.command.CommandSender  
import org.bukkit.entity.Player  
import org.bukkit.plugin.java.JavaPlugin  
import org.bukkit.util.Vector
```
Bukkit zatem służy - w uproszczeniu - do komunikacji z Minecraftem.

W następnych linijkach kodu mamy do czynienia z kodem nawiązującym do samego pluginu. Świadczy o tym klasa `Plugin_template`, która implementuje klasę abstrakcyjną `JavaPlugin`:
```kotlin
class Plugin_template : JavaPlugin() { ... }
```
Zaraz, zaraz, co oznacza, "implementuje klasę abstrakcyjną `JavaPlugin`"?
W skrócie oznacza to, że nadajemy klasie `Plugin_template` funkcjonalność taką, jaką powinien mieć `JavaPlugin`, czyli w istocie tak zapisujemy, że `Plugin_template` **jest pluginem**. `Plugin_template` jest po prostu nazwą plugina (ma "template" w nazwie, bo jest ona częscią schematu plugina opublikowanego na GitHubie). `JavaPlugin` to jest plugin wykorzystujący funkcjonalność Javy (a Kotlin jest do Javy bardzo zbliżony).

Przechodzimy do dalszej części:
```kotlin
class Plugin_template : JavaPlugin() {  
    override fun onEnable() {  
        // Plugin startup logic  
        getCommand("jump")?.setExecutor(JumpCommand())  
    }  
  
    override fun onDisable() {  
        // Plugin shutdown logic  
    }  
}  
```

W klasie `Plugin_template`, o której Minecraft już wie, że jest pluginem, znajdują się dwie funkcje (formalnie metody), które odpowiadają za funkcjonalność w momencie załadowania pluginu (`onEnable()`) i za funkcjonalność w momencie wyłączenia pluginu (`onDisable()`). Czyli `onEnable()` uruchomi się jeszcze na etapie włączenia serwera z tym pluginem, zaś `onDisable()` uruchomi się w momencie wyłączenia serwera.

Jak widać, plugin w momencie jego uruchomienia wykona tę linijkę:
```kotlin
getCommand("jump")?.setExecutor(JumpCommand())
```
Funkcja `getCommand("jump")` informuje Minecrafta o istnieniu komendy `jump`. Oprócz tego należy wpisać w plik `src/resources/plugin.yml` coś takiego:
```yaml
name: plugin-template  
version: '${version}'  
main: com.hackclub.alopb.plugintemplate.Plugin_template  
api-version: '1.20'  
commands:  
  jump:  
    description: (your description)
```
bo inaczej plugin nie będzie świadomy tej komendy. Plik YAML to po prostu inny format przechowywanie danych, działa w taki sam sposób jak JSON.

Funkcja `setExecutor()` podpina do danej komendy klasę odpowiadającą za samo działanie komendy. W tym wypadku `setExecutor(JumpCommand())` podpina klasę `JumpCommand` do komendy `jump`.

W tej linijce jest jeszcze jedna rzecz do wyjaśnienia - znak zapytania występujący między `getCommand()` a `setExecutor()`. W Kotlinie jest to tzw. safe call, czyli operator, który nie wykona dalszej części łańcuchu wywołań funkcji, jeśli lewa strona zwróci `null` - brak wartości. Wtedy obliczona przez program wartość całego tego łańcuchu jest równa `null`. Ten operator jest potrzebny, ponieważ lewa strona może zwrócić `null`, a prawa strona potrzebuje prawdziwej wartości komendy, nie `null`a.

Przechodzimy do klasy `JumpCommand`, odpowiadającej za funkcjonalność komendy `jump`:
```kotlin
class JumpCommand: CommandExecutor {  
    override fun onCommand(sender: CommandSender, p1: Command, p2: String, p3: Array<out String>?): Boolean {  
        if (sender is Player) {  
            sender.velocity = sender.velocity.add(Vector(0.0, 5.0, 0.0))  
        }  
  
		return true  
    }  
}
```

Klasa `JumpCommand` implementuje interfejs `CommandExecutor`. Oznacza to, że klasa `JumpCommand` jest `CommandExecutor`em i musi zawierać w sobie funkcję onCommand, która wykonuje się za każdym razem, kiedy komenda zostanie wpisana.

Argumentami funkcji `onCommand` są `sender`, typu  `CommandSender`, czyli byt, który wpisał komendę (gracz lub serwer), natomiast pozostałe argumenty nie są warte naszej uwagi.

Następnie sprawdzamy, czy `sender` jest graczem, co sprawdzamy poprzez keyworda `is`. Jeśli faktycznie jest graczem, to wybijamy go w powietrze, czyli dodajemy szybkość w koordynacie y (góra/dół). `return true` na koniec oznacza zwrócenie informacji, że komenda wykonała się pomyślnie.