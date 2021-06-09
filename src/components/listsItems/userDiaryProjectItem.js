import React, {useState} from 'react';
import moment from 'moment';
import locale from '../../locale';
import TimeProgressItem from './timeProgressItem';
import TaskProgressItem from './taskProgressItem';

const userDiaryProjectItem = ({projectTimers, project}) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleVisibilityCallback = () => {
    setIsOpened(!isOpened);
  };

  return (
    <>
      <TimeProgressItem
        items={projectTimers}
        key={project.name}
        title={project.name}
        subtitle={moment
          .duration(project.work_time + project.no_work_time, 'seconds')
          .format(`H [${locale.ru.hours}] mm [${locale.ru.minutes}]`)}
        toggleVisibilityCallback={toggleVisibilityCallback}
        isOpened={isOpened}
      />
      {project.tasks.length &&
        isOpened &&
        project.tasks.map(task => (
          <TaskProgressItem
            users={task.users}
            title={task.title}
            subtitle={moment
              .duration(task.labor, 'seconds')
              .format(`H [${locale.ru.hours}] mm [${locale.ru.minutes}]`)}
          />
        ))}
    </>
  );
};

export default userDiaryProjectItem;
